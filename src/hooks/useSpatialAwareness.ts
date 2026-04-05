"use client"

import { useState, useEffect } from "react"

export function useSpatialAwareness() {
  const [heading, setHeading] = useState<number>(0)
  const [tilt, setTilt] = useState<number>(0)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    // Only run on the client
    if (typeof window === "undefined") return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // 'alpha' represents the compass heading (0-360 degrees)
      // Note: WebKit handles absolute compass differently than standard Android
      let currentHeading = event.alpha || 0

      if ((event as any).webkitCompassHeading) {
        // iOS devices
        currentHeading = (event as any).webkitCompassHeading
      } else {
        // Android devices (Needs to be converted from device orientation to compass heading)
        // This is a simplified fallback; absolute orientation requires more complex math on Android
        currentHeading = 360 - currentHeading
      }

      // 'beta' is the front-to-back tilt (-180 to 180)
      const currentTilt = event.beta || 0

      // Smooth out the numbers to prevent jitter
      setHeading((prev) => {
        // Simple easing function for smoother HUD rotation
        return prev + (currentHeading - prev) * 0.2
      })
      setTilt(currentTilt)
      setIsTracking(true)
    }

    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation as any,
    )
    // Fallback for devices that don't support absolute orientation
    window.addEventListener("deviceorientation", handleOrientation)

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation as any,
      )
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

  return { heading, tilt, isTracking }
}
