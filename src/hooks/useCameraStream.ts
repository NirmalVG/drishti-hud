"use client"

import { useState, useEffect, useRef } from "react"

export function useCameraStream() {
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true) // Added state
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    async function setupCamera() {
      try {
        const constraints = {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          const track = stream.getVideoTracks()[0]
          const settings = track.getSettings()

          // Auto-flip for front vs back camera
          if (settings.facingMode === "user") {
            videoRef.current.style.transform = "scaleX(-1)"
          } else {
            videoRef.current.style.transform = "scaleX(1)"
          }

          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setIsInitializing(false) // Camera successfully painted
          }
        }
      } catch (err: any) {
        setError("CAMERA_UNAVAILABLE: Check permissions.")
        setIsInitializing(false) // Stop loading if failed
      }
    }

    setupCamera()
  }, [])

  // Return the variable so CameraFeed can use it
  return { videoRef, error, isInitializing }
}
