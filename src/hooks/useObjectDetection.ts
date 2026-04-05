"use client"

import { useState, useEffect, useRef, RefObject } from "react"
import { initializeObjectDetector } from "@/lib/mediapipe/objectDetector"

export function useObjectDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const [detections, setDetections] = useState<any[]>([])
  const [isReady, setIsReady] = useState(false)
  const isProcessing = useRef(false)
  const isActive = useRef(true)

  useEffect(() => {
    let detector: any = null

    async function startSystem() {
      try {
        detector = await initializeObjectDetector()
        setIsReady(true)
        loop()
      } catch (e) {
        console.error("VYUHA CORE LOAD FAILURE:", e)
      }
    }

    async function loop() {
      if (!isActive.current || !videoRef.current || !detector) return

      const video = videoRef.current

      // 1. CHOKE GUARD: If the AI is still busy, skip this frame to keep UI smooth.
      if (isProcessing.current) {
        requestAnimationFrame(loop)
        return
      }

      if (video.readyState >= 2 && video.videoWidth > 0) {
        isProcessing.current = true

        try {
          // 2. We AWAIT the inference. This keeps the thread serial.
          const results = await detector.detectForVideo(
            video,
            performance.now(),
          )
          setDetections(results.detections || [])
        } catch (e) {
          console.warn("Vyuha Inference Error:", e)
        } finally {
          // 3. MANDATORY COOL-DOWN: Gives the browser 50ms to handle UI/Touch events
          setTimeout(() => {
            isProcessing.current = false
          }, 50)
        }
      }

      requestAnimationFrame(loop)
    }

    startSystem()

    return () => {
      isActive.current = false
    }
  }, [videoRef])

  return { detections, isReady }
}
