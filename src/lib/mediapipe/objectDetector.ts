import { ObjectDetector, FilesetResolver } from "@mediapipe/tasks-vision"

// We keep a global reference so we don't reload the model multiple times
let detectorInstance: ObjectDetector | null = null
let isInitializing = false

export async function initializeObjectDetector(): Promise<ObjectDetector> {
  if (detectorInstance) return detectorInstance

  // Prevent race conditions if multiple components try to load it at once
  if (isInitializing) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (detectorInstance) {
          clearInterval(interval)
          resolve(detectorInstance)
        }
      }, 100)
    })
  }

  isInitializing = true
  console.log("INITIALIZING VYUHA CORE: Loading MediaPipe WASM...")

  try {
    // 1. Load the WebAssembly files necessary to run the AI in the browser
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    )

    // 2. Initialize the Object Detector with our local model
    detectorInstance = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/efficientdet_lite0.tflite",
        delegate: "GPU", // Use the device's GPU for 30+ FPS!
      },
      scoreThreshold: 0.5, // Only show objects it is 50% or more confident about
      runningMode: "VIDEO", // Optimized for continuous camera streams
    })

    console.log("VYUHA CORE ONLINE: Object Detector Ready.")
    isInitializing = false
    return detectorInstance
  } catch (error) {
    console.error("CRITICAL FAILURE: Could not load Drishti AI Engine", error)
    isInitializing = false
    throw error
  }
}
