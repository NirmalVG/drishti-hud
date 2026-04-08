"use client"

import { FaceLandmarkerResult } from "@mediapipe/tasks-vision"
import {
  projectNormalizedBoxToViewport,
  VideoOverlayMetrics,
} from "@/lib/utils/videoOverlay"

interface FaceTargetingProps {
  faces: FaceLandmarkerResult | null
  isMirrored: boolean
  overlayMetrics: VideoOverlayMetrics | null
}

export default function FaceTargeting({
  faces,
  isMirrored,
  overlayMetrics,
}: FaceTargetingProps) {
  if (
    !faces ||
    !faces.faceLandmarks ||
    faces.faceLandmarks.length === 0 ||
    !overlayMetrics
  ) {
    return null
  }

  return (
    <>
      {faces.faceLandmarks.map((landmarks, index) => {
        // Find the min/max X and Y to create a bounding box around the face mesh
        const xs = landmarks.map((l) => l.x)
        const ys = landmarks.map((l) => l.y)

        const minX = Math.min(...xs)
        const maxX = Math.max(...xs)
        const minY = Math.min(...ys)
        const maxY = Math.max(...ys)

        const projectedBox = projectNormalizedBoxToViewport(
          overlayMetrics,
          {
            x: Math.max(0, minX - 0.05),
            y: Math.max(0, minY - 0.05),
            width: Math.min(1, maxX - minX + 0.1),
            height: Math.min(1, maxY - minY + 0.1),
          },
          isMirrored,
        )

        if (!projectedBox) {
          return null
        }

        return (
          <div
            key={`face-${index}`}
            className="absolute border-[1px] border-[#45A29E] bg-[#45A29E]/5 shadow-[0_0_20px_rgba(69,162,158,0.2)] transition-all duration-75 pointer-events-none z-10 flex items-center justify-center"
            style={{
              top: projectedBox.top,
              left: projectedBox.left,
              width: projectedBox.width,
              height: projectedBox.height,
            }}
          >
            {/* High-tech Teal Reticle Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#45A29E]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#45A29E]" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#45A29E]" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#45A29E]" />

            {/* Inner scanning line */}
            <div className="w-full h-[1px] bg-[#45A29E]/50 absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(69,162,158,0.8)]" />

            {/* Biometric Tag */}
            <div className="absolute -top-6 right-0 bg-[#45A29E] text-black text-[9px] font-bold px-3 py-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              BIOMETRIC LOCK
            </div>
          </div>
        )
      })}
    </>
  )
}
