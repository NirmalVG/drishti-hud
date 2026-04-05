"use client"

import { useState, useEffect, useRef } from "react"

export function useDrishtiWorker(
  videoRef: React.RefObject<HTMLVideoElement | null>,
) {
  const [results, setResults] = useState({ detections: [], faces: null })
  const [isReady, setIsReady] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const isBusy = useRef(false)

  // NEW: A dedicated canvas to guarantee pixel extraction
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    // 1. Setup the invisible canvas once
    if (!canvasRef.current && typeof document !== "undefined") {
      canvasRef.current = document.createElement("canvas")
    }

    workerRef.current = new Worker(
      new URL("../workers/drishti.worker.ts", import.meta.url),
      { type: "module" },
    )
    workerRef.current.postMessage({ type: "INIT" })

    workerRef.current.onmessage = (e) => {
      if (e.data.type === "READY") {
        console.log("🟢 VYUHA CORE: SYSTEM STABLE & READY")
        setIsReady(true)
      } else if (e.data.type === "RESULT") {
        setResults({
          detections: e.data.detections?.detections || [],
          faces: e.data.faces,
        })
        isBusy.current = false
      } else if (e.data.type === "ERROR") {
        console.error("🔴 VYUHA CORE CRITICAL ERROR:", e.data.message)
      }
    }

    const loop = async () => {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Ensure video is actually playing and has dimensions
      if (
        video &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        isReady &&
        !isBusy.current &&
        canvas
      ) {
        // 2. Force the video dimensions onto the canvas
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        const ctx = canvas.getContext("2d", { willReadFrequently: true })

        if (ctx) {
          try {
            // 3. Explicitly paint the video frame to the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            // 4. Extract the pixels from the canvas, NOT the video tag
            const imageBitmap = await createImageBitmap(canvas)

            isBusy.current = true
            workerRef.current?.postMessage(
              {
                type: "PROCESS",
                imageBitmap,
                timestamp: performance.now(),
              },
              [imageBitmap],
            )
          } catch (err) {
            console.warn("Pixel extraction failed, skipping frame.")
          }
        }
      }
      // Run the loop again
      requestAnimationFrame(loop)
    }

    if (isReady) loop()

    return () => workerRef.current?.terminate()
  }, [isReady, videoRef])

  return { ...results, isReady }
}
