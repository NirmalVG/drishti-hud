"use client"

import { useState, useEffect, useRef } from "react"

export function useCameraStream() {
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isMirrored, setIsMirrored] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let isCancelled = false
    let videoElement: HTMLVideoElement | null = null

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
        streamRef.current = stream

        if (isCancelled || !videoRef.current) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        videoElement = videoRef.current
        videoElement.srcObject = stream

        const track = stream.getVideoTracks()[0]
        const settings = track?.getSettings()
        const mirrored = settings?.facingMode === "user"

        setIsMirrored(mirrored)
        videoElement.style.transform = mirrored ? "scaleX(-1)" : "scaleX(1)"

        videoElement.onloadedmetadata = async () => {
          try {
            await videoElement?.play()
          } finally {
            if (!isCancelled) {
              setIsInitializing(false)
            }
          }
        }
      } catch {
        if (!isCancelled) {
          setError("CAMERA_UNAVAILABLE: Check permissions.")
          setIsInitializing(false)
        }
      }
    }

    setupCamera()

    return () => {
      isCancelled = true
      videoElement?.pause()
      if (videoElement) {
        videoElement.onloadedmetadata = null
        videoElement.srcObject = null
      }
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  return { videoRef, error, isInitializing, isMirrored }
}
