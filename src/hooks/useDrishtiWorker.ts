"use client"

import { useEffect, useRef, useState } from "react"

export function useDrishtiWorker(
  videoRef: React.RefObject<HTMLVideoElement | null>,
) {
  const [results, setResults] = useState({ detections: [], faces: null })
  const [isReady, setIsReady] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isBusy = useRef(false)

  useEffect(() => {
    if (!canvasRef.current && typeof document !== "undefined") {
      canvasRef.current = document.createElement("canvas")
    }

    const worker = new Worker(
      new URL("../workers/drishti.worker.ts", import.meta.url),
      { type: "module" },
    )

    workerRef.current = worker
    worker.postMessage({ type: "INIT" })

    worker.onmessage = (e) => {
      if (e.data.type === "READY") {
        console.log("VYUHA CORE: SYSTEM STABLE & READY")
        setIsReady(true)
        return
      }

      if (e.data.type === "RESULT") {
        setResults({
          detections: e.data.detections?.detections || [],
          faces: e.data.faces,
        })
        isBusy.current = false
        return
      }

      if (e.data.type === "ERROR") {
        console.error("VYUHA CORE CRITICAL ERROR:", e.data.message)
        isBusy.current = false
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      worker.terminate()
      workerRef.current = null
      isBusy.current = false
      setIsReady(false)
    }
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    let isCancelled = false

    const loop = async () => {
      if (isCancelled) {
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current

      if (
        video &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        !isBusy.current &&
        canvas
      ) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        const ctx = canvas.getContext("2d", { willReadFrequently: true })

        if (ctx) {
          try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const imageBitmap = await createImageBitmap(canvas)

            if (imageBitmap.width === 0 || imageBitmap.height === 0) {
              imageBitmap.close()
              isBusy.current = false
              animationFrameRef.current = requestAnimationFrame(loop)
              return
            }

            isBusy.current = true
            workerRef.current?.postMessage(
              {
                type: "PROCESS",
                imageBitmap,
                timestamp: performance.now(),
              },
              [imageBitmap],
            )
          } catch {
            console.warn("Pixel extraction failed, skipping frame.")
            isBusy.current = false
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      isCancelled = true

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      isBusy.current = false
    }
  }, [isReady, videoRef])

  return { ...results, isReady }
}
