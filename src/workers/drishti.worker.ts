import {
  FilesetResolver,
  ObjectDetector,
  FaceLandmarker,
} from "@mediapipe/tasks-vision"

// Global references to our AI models
let detector: ObjectDetector | null = null
let tracker: FaceLandmarker | null = null
let detectorDelegate: "CPU" | "GPU" = "CPU"
let trackerDelegate: "CPU" | "GPU" = "GPU"
let vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null = null
let isReinitializing = false

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

async function loadVision() {
  if (vision) {
    return vision
  }

  postMessage({
    type: "LOG",
    message: "Worker: Initializing via Next.js Bundler...",
  })

  vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  )

  return vision
}

async function createEngines(
  nextDetectorDelegate: "CPU" | "GPU",
  nextTrackerDelegate: "CPU" | "GPU",
) {
  const visionTasks = await loadVision()

  postMessage({
    type: "LOG",
    message: `Worker: Booting Vyuha Core on ${nextDetectorDelegate} and Biometrics on ${nextTrackerDelegate}...`,
  })

  const nextDetector = await ObjectDetector.createFromOptions(visionTasks, {
    baseOptions: {
      modelAssetPath: "/models/efficientdet_lite0.tflite",
      delegate: nextDetectorDelegate,
    },
    runningMode: "VIDEO",
    scoreThreshold: 0.25,
  })

  postMessage({
    type: "LOG",
    message: `Worker: Vyuha Core online on ${nextDetectorDelegate}. Booting Biometrics on ${nextTrackerDelegate}...`,
  })

  const nextTracker = await FaceLandmarker.createFromOptions(visionTasks, {
    baseOptions: {
      modelAssetPath: "/models/face_landmarker.task",
      delegate: nextTrackerDelegate,
    },
    runningMode: "VIDEO",
    numFaces: 1,
  })

  detector = nextDetector
  tracker = nextTracker
  detectorDelegate = nextDetectorDelegate
  trackerDelegate = nextTrackerDelegate
}

async function init() {
  try {
    await createEngines("CPU", "GPU")
    postMessage({
      type: "READY",
      delegate: { detector: "CPU", tracker: "GPU" },
    })
  } catch (error: unknown) {
    const message = getErrorMessage(error)

    if (trackerDelegate === "GPU") {
      postMessage({
        type: "LOG",
        message: `Worker: GPU biometrics init failed (${message}). Falling back to CPU biometrics.`,
      })
      await createEngines("CPU", "CPU")
      postMessage({
        type: "READY",
        delegate: { detector: "CPU", tracker: "CPU" },
      })
      return
    }

    postMessage({
      type: "ERROR",
      message: `AI Engine Crash: ${message}`,
    })
  }
}

async function fallbackToCpu(reason: string) {
  if (
    (detectorDelegate === "CPU" && trackerDelegate === "CPU") ||
    isReinitializing
  ) {
    return
  }

  isReinitializing = true

  try {
    postMessage({
      type: "LOG",
      message: `Worker: GPU inference failed (${reason}). Switching all inference to CPU.`,
    })
    await createEngines("CPU", "CPU")
    postMessage({
      type: "READY",
      delegate: { detector: "CPU", tracker: "CPU" },
    })
  } catch (error: unknown) {
    postMessage({
      type: "ERROR",
      message: `CPU fallback failed: ${getErrorMessage(error)}`,
    })
  } finally {
    isReinitializing = false
  }
}

// 5. The High-Speed Frame Processing Loop
self.onmessage = async (e: MessageEvent) => {
  if (e.data.type === "INIT") {
    await init()
  } else if (e.data.type === "PROCESS") {
    const { imageBitmap, timestamp } = e.data

    // If AI isn't ready, silently discard the frame to prevent memory leaks
    if (!detector || !tracker || isReinitializing) {
      imageBitmap.close()
      return
    }

    if (
      !imageBitmap ||
      imageBitmap.width <= 0 ||
      imageBitmap.height <= 0 ||
      !Number.isFinite(timestamp)
    ) {
      imageBitmap?.close?.()
      return
    }

    try {
      // Run both neural networks simultaneously on the same frame
      const detections = detector.detectForVideo(imageBitmap, timestamp)
      const faces = tracker.detectForVideo(imageBitmap, timestamp)

      // Send the telemetry back to the UI
      postMessage({ type: "RESULT", detections, faces })
    } catch (error: unknown) {
      const message = getErrorMessage(error)

      if (message.toLowerCase().includes("divide by zero")) {
        await fallbackToCpu(message)
        return
      }

      postMessage({
        type: "ERROR",
        message: `Inference Crash: ${message}`,
      })
    } finally {
      // CRITICAL: Always close the bitmap or the mobile browser will crash from OOM (Out of Memory)
      imageBitmap.close()
    }
  }
}
