"use client"

import { useCameraStream } from "@/hooks/useCameraStream"

export default function CameraFeed() {
  const { videoRef, error, isInitializing } = useCameraStream()

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-color-hud-alert font-mono p-4 text-center z-50 absolute">
        <p>SYSTEM ERROR: {error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Initialization Text */}
      {isInitializing && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-color-hud-primary font-mono animate-pulse">
          <p>INITIALIZING DRISHTI OPTICS...</p>
        </div>
      )}

      {/* The raw camera feed. Object-cover ensures it fills the screen without stretching */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isInitializing ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* A subtle scanline overlay to give it that tech/HUD aesthetic */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:100%_4px] z-10 mix-blend-overlay"></div>
    </div>
  )
}
