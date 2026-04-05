"use client"

import { useState, useEffect } from "react"

export function useObjectHistory(detections: any[]) {
  const [history, setHistory] = useState<{ label: string; time: string }[]>([])

  useEffect(() => {
    if (detections.length > 0) {
      const newLabel = detections[0].categories[0].categoryName.toUpperCase()
      const timestamp = new Date().toLocaleTimeString([], {
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      })

      setHistory((prev) => {
        // Prevent duplicate spam of the same object
        if (prev.length > 0 && prev[0].label === newLabel) return prev
        // Keep only the last 5 unique detections
        return [{ label: newLabel, time: timestamp }, ...prev].slice(0, 5)
      })
    }
  }, [detections])

  return history
}
