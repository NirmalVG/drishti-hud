import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

let faceTrackerInstance: FaceLandmarker | null = null
let isInitializing = false

export async function initializeFaceTracker(): Promise<FaceLandmarker> {
  if (faceTrackerInstance) return faceTrackerInstance

  if (isInitializing) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (faceTrackerInstance) {
          clearInterval(interval)
          resolve(faceTrackerInstance)
        }
      }, 100)
    })
  }

  isInitializing = true
  console.log("INITIALIZING BIOMETRICS: Loading FaceLandmarker...")

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    )

    faceTrackerInstance = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/face_landmarker.task",
        delegate: "GPU",
      },
      outputFaceBlendshapes: false, // Turn off to save processing power
      runningMode: "VIDEO",
      numFaces: 3, // Max faces to track simultaneously
    })

    console.log("BIOMETRICS ONLINE: Face Tracker Ready.")
    isInitializing = false
    return faceTrackerInstance
  } catch (error) {
    console.error("CRITICAL FAILURE: Could not load Biometric Engine", error)
    isInitializing = false
    throw error
  }
}
