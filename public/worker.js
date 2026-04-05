// public/worker.js

// 1. Clean ES Module Import from the local 1.5MB file you downloaded
import {
  FilesetResolver,
  ObjectDetector,
  FaceLandmarker,
} from "./vision_bundle.js"

let detector
let tracker

async function init() {
  try {
    postMessage({
      type: "LOG",
      message: "Worker: Starting AI initialization...",
    })

    // 2. Load the WebAssembly Math Engine (Bypassing jsdelivr network blocks)
    const vision = await FilesetResolver.forVisionTasks(
      "https://unpkg.com/@mediapipe/tasks-vision@latest/wasm",
    )

    postMessage({
      type: "LOG",
      message: "Worker: WASM loaded. Loading Vyuha Core...",
    })

    // 3. Boot up Object Detection
    detector = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/efficientdet_lite0.tflite",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      scoreThreshold: 0.5,
    })

    postMessage({
      type: "LOG",
      message: "Worker: Vyuha Core loaded. Loading Biometrics...",
    })

    // 4. Boot up Face Tracking
    tracker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
    })

    // 5. Signal the UI
    postMessage({ type: "READY" })
  } catch (error) {
    postMessage({ type: "ERROR", message: `AI Engine Crash: ${error.message}` })
  }
}

// 6. The High-Speed Processing Loop
onmessage = async (e) => {
  if (e.data.type === "INIT") {
    await init()
  } else if (e.data.type === "PROCESS") {
    const { imageBitmap, timestamp } = e.data

    if (!detector || !tracker) {
      imageBitmap.close()
      return
    }

    try {
      const detections = detector.detectForVideo(imageBitmap, timestamp)
      const faces = tracker.detectForVideo(imageBitmap, timestamp)

      postMessage({ type: "RESULT", detections, faces })
    } catch (err) {
      postMessage({ type: "ERROR", message: `Inference Crash: ${err.message}` })
    } finally {
      // Always close the bitmap to prevent the Samsung S23 from running out of RAM
      imageBitmap.close()
    }
  }
}
