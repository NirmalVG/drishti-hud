"use client"

import { useSpatialAwareness } from "@/hooks/useSpatialAwareness"

export default function CenterReticle() {
  const { heading, tilt } = useSpatialAwareness()

  // Helper to format degrees into a 3-digit string (e.g., 45 -> "045°")
  const formatHeading = (deg: number) => {
    // Normalize to 0-360
    let normalized = Math.round(deg) % 360
    if (normalized < 0) normalized += 360
    return normalized.toString().padStart(3, "0") + "°"
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] flex flex-col items-center justify-center opacity-60 pointer-events-none">
      {/* Dynamic Digital Readout */}
      <div className="absolute -top-12 text-[#FF9933] font-bold tracking-widest text-sm bg-black/50 px-3 py-1 rounded-sm border border-[#FF9933]/30">
        HDG: {formatHeading(heading)}
      </div>

      {/* Rotating Compass Ring */}
      <div
        className="absolute w-full h-full transition-transform duration-75 ease-linear"
        style={{ transform: `rotate(${-heading}deg)` }}
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-[#FF9933] font-bold">
          N
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-[#FF9933]">
          S
        </span>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-[#FF9933]">
          W
        </span>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-[#FF9933]">
          E
        </span>

        {/* Subtle tick marks for the compass */}
        <div className="absolute inset-0 rounded-full border border-white/5" />
      </div>

      {/* Static Crosshair Lines (These stay locked to the screen) */}
      <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#FF9933]/30 to-transparent" />
      <div className="absolute h-[80%] w-[1px] bg-gradient-to-b from-transparent via-[#FF9933]/30 to-transparent" />

      {/* Concentric Center Geometry - Tilts based on phone angle! */}
      <div
        className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full border border-white/10 flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transform: `perspective(500px) rotateX(${tilt > 45 && tilt < 135 ? tilt - 90 : 0}deg)`,
        }}
      >
        <div className="w-[80px] md:w-[120px] h-[80px] md:h-[120px] border border-[#45A29E]/40 rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(69,162,158,0.1)]">
          <div className="w-[50px] md:w-[80px] h-[50px] md:h-[80px] border border-[#FF9933]/30 flex items-center justify-center -rotate-45">
            <div className="w-4 h-4 border-2 border-[#FF9933] shadow-[0_0_10px_rgba(255,153,51,0.5)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
