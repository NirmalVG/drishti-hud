"use client"

import { useState, useEffect, useRef } from "react"

export function useCameraStream() {
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    async function setupCamera() {
      try {
        const constraints = {
          video: {
            // 'environment' forces the back camera on your S23
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          // Check if we are actually using the front camera
          // If so, we might need to flip it back via CSS
          const track = stream.getVideoTracks()[0]
          const settings = track.getSettings()

          if (settings.facingMode === "user") {
            videoRef.current.style.transform = "scaleX(-1)" // Mirror for selfie mode
          } else {
            videoRef.current.style.transform = "scaleX(1)" // Normal for back camera
          }

          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
          }
        }
      } catch (err: any) {
        setError("CAMERA_UNAVAILABLE: Check permissions.")
      }
    }

    setupCamera()
  }, [])

  return { videoRef, error }
}
