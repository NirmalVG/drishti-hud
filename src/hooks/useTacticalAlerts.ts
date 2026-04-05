"use client"

import { useState, useEffect } from "react"

export function useTacticalAlerts(detections: any[], faces: any) {
  const [alert, setAlert] = useState<string | null>(null)

  useEffect(() => {
    if (faces?.faceLandmarks?.length > 0) {
      setAlert("BIOMETRIC_LOCK_STABLE")
    } else if (
      detections.some((d) => d.categories[0].categoryName === "person")
    ) {
      setAlert("HUMAN_SIGNATURE_DETECTED")
    } else {
      setAlert(null)
    }
  }, [detections, faces])

  return alert
}
