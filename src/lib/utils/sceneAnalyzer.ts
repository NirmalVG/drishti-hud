import { Detection, FaceLandmarkerResult } from "@mediapipe/tasks-vision"

export function analyzeScene(
  detections: Detection[],
  faces: FaceLandmarkerResult | null,
) {
  const objectCounts: Record<string, number> = {}

  detections.forEach((det) => {
    const label = det.categories[0].categoryName
    objectCounts[label] = (objectCounts[label] || 0) + 1
  })

  const faceCount = faces?.faceLandmarks?.length || 0
  const totalObjects = detections.length

  // Logic for a "Tactical Summary"
  if (totalObjects === 0 && faceCount === 0) {
    return "Scanning... No high-priority targets in visual field."
  }

  let report = `Visual field clear. Detected ${totalObjects} objects`
  if (faceCount > 0) {
    report += ` and ${faceCount} biometric signature${faceCount > 1 ? "s" : ""}.`
  } else {
    report += "."
  }

  // Identify the closest/most prominent object
  if (detections.length > 0) {
    const primary = detections[0].categories[0].categoryName
    report += ` Primary focus: ${primary}.`
  }

  return report
}
