"use client"

import { useState, useEffect, useRef, RefObject } from "react"
import { initializeFaceTracker } from "@/lib/mediapipe/faceTracker"

export function useFaceTracking(videoRef: RefObject<HTMLVideoElement | null>) {
  const [faces, setFaces] = useState<any>(null)
  const [isFaceReady, setIsFaceReady] = useState(false)
  const isProcessing = useRef(false)
  const isActive = useRef(true)

  useEffect(() => {
    let tracker: any = null

    async function startTracking() {
      try {
        tracker = await initializeFaceTracker()
        setIsFaceReady(true)
        loop()
      } catch (e) {
        console.error("BIOMETRIC ENGINE LOAD FAILURE:", e)
      }
    }

    async function loop() {
      if (!isActive.current || !videoRef.current || !tracker) return

      const video = videoRef.current

      // 1. CHOKE GUARD: Face mesh is heavy (468 points), we MUST skip if busy.
      if (isProcessing.current) {
        requestAnimationFrame(loop)
        return
      }

      if (video.readyState >= 2 && video.videoWidth > 0) {
        isProcessing.current = true

        try {
          // 2. Serial Inference
          const results = await tracker.detectForVideo(video, performance.now())
          setFaces(results)
        } catch (e) {
          console.warn("Biometric Inference Error:", e)
        } finally {
          // 3. LONGER COOL-DOWN: Faces move slower, we can save CPU here.
          setTimeout(() => {
            isProcessing.current = false
          }, 80)
        }
      }

      requestAnimationFrame(loop)
    }

    startTracking()

    return () => {
      isActive.current = false
    }
  }, [videoRef])

  return { faces, isFaceReady }
}
