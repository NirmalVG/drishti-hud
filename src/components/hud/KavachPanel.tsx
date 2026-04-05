"use client"

import { useObjectHistory } from "@/hooks/useObjectHistory"

interface KavachPanelProps {
  detections: any[]
}

export default function KavachPanel({ detections }: KavachPanelProps) {
  const history = useObjectHistory(detections)

  return (
    <div className="relative bg-[#0B0C10]/90 border border-[#FF9933]/20 p-4 w-full md:w-72 shadow-2xl pointer-events-auto">
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FF9933]" />

      <div className="flex items-center gap-3 mb-3">
        <div className="text-[#FF9933] text-lg">🛡️</div>
        <div>
          <h2 className="text-white font-bold tracking-widest text-[10px] uppercase">
            Kavach History
          </h2>
          <div className="h-[1px] w-full bg-gradient-to-r from-[#FF9933] to-transparent mt-1" />
        </div>
      </div>

      <div className="space-y-1.5 min-h-[60px]">
        {history.length === 0 ? (
          <p className="text-white/20 text-[8px] italic uppercase">
            Awaiting tactical data...
          </p>
        ) : (
          history.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-[9px] border-b border-white/5 pb-1"
            >
              <span className="text-[#45A29E] font-bold">[{item.time}]</span>
              <span className="text-white/70 uppercase">{item.label}</span>
              <span className="text-[#FF9933] text-[7px]">LOGGED</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
