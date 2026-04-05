import {
  FilesetResolver,
  ObjectDetector,
  FaceLandmarker,
} from "@mediapipe/tasks-vision"

// Global references to our AI models
let detector: ObjectDetector | null = null
let tracker: FaceLandmarker | null = null

async function init() {
  try {
    postMessage({
      type: "LOG",
      message: "Worker: Initializing via Next.js Bundler...",
    })

    // 1. Load the WebAssembly Engine (Using jsdelivr as Webpack handles the JS natively now)
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    )

    postMessage({
      type: "LOG",
      message: "Worker: WASM loaded. Booting Vyuha Core...",
    })

    // 2. Initialize Object Detection
    detector = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/efficientdet_lite0.tflite",
        delegate: "GPU", // Hardware acceleration
      },
      runningMode: "VIDEO",
      scoreThreshold: 0.25, // Lowered to 25% confidence so it easily picks up objects
    })

    postMessage({
      type: "LOG",
      message: "Worker: Vyuha Core online. Booting Biometrics...",
    })

    // 3. Initialize Face Tracking
    tracker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/face_landmarker.task",
        delegate: "GPU", // Hardware acceleration
      },
      runningMode: "VIDEO",
      numFaces: 1,
    })

    // 4. Signal the Main Thread that optics are online
    postMessage({ type: "READY" })
  } catch (error: any) {
    postMessage({ type: "ERROR", message: `AI Engine Crash: ${error.message}` })
  }
}

// 5. The High-Speed Frame Processing Loop
self.onmessage = async (e: MessageEvent) => {
  if (e.data.type === "INIT") {
    await init()
  } else if (e.data.type === "PROCESS") {
    const { imageBitmap, timestamp } = e.data

    // If AI isn't ready, silently discard the frame to prevent memory leaks
    if (!detector || !tracker) {
      imageBitmap.close()
      return
    }

    try {
      // Run both neural networks simultaneously on the same frame
      const detections = detector.detectForVideo(imageBitmap, timestamp)
      const faces = tracker.detectForVideo(imageBitmap, timestamp)

      // Send the telemetry back to the UI
      postMessage({ type: "RESULT", detections, faces })
    } catch (err: any) {
      postMessage({ type: "ERROR", message: `Inference Crash: ${err.message}` })
    } finally {
      // CRITICAL: Always close the bitmap or the mobile browser will crash from OOM (Out of Memory)
      imageBitmap.close()
    }
  }
}
