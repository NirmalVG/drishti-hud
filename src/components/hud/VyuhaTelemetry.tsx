"use client"

interface VyuhaTelemetryProps {
  isReady: boolean
  objectCount: number
}

export default function VyuhaTelemetry({
  isReady,
  objectCount,
}: VyuhaTelemetryProps) {
  return (
    <div className="relative bg-[#0B0C10]/80 backdrop-blur-md border border-[#45A29E]/20 p-4 md:p-5 w-full md:w-64 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-auto">
      {/* Top Accent Line */}
      <div className="absolute top-0 right-0 w-16 h-[2px] bg-[#45A29E]" />

      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-[#45A29E] font-bold tracking-widest text-[10px] uppercase">
            Vyuha Telemetry
          </h2>
          <p
            className={`text-[9px] font-mono mt-1 ${isReady ? "text-[#45A29E] animate-pulse" : "text-red-500"}`}
          >
            {isReady ? "● SYSTEM_STABLE" : "○ SYNC_REQUIRED"}
          </p>
        </div>
        <div className="text-right">
          <span className="text-white/40 text-[8px] block">TARGETS</span>
          <span className="text-white font-bold text-xl">
            {objectCount.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Mini Performance Graph (Visual Only) */}
      <div className="flex items-end gap-[2px] h-8 w-full border-b border-white/10 pb-1">
        {[40, 70, 45, 90, 65, 80, 30, 50, 85, 60].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-[#45A29E]/30 border-t border-[#45A29E]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[7px] text-white/50 tracking-tighter">
        <span>LATENCY: 42MS</span>
        <span>UPLINK: 98%</span>
      </div>
    </div>
  )
}
