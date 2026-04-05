"use client"

interface YantraDashboardProps {
  onClose: () => void
}

export default function YantraDashboard({ onClose }: YantraDashboardProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="relative bg-[#0B0C10]/90 border border-[#FF9933]/30 p-8 w-[90%] max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-[#FF9933] -mt-[2px] -ml-[2px]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-[#FF9933] -mb-[2px] -mr-[2px]" />

        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#FF9933]/20 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF9933]/10 border border-[#FF9933]/50 flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div>
              <h2 className="text-[#FF9933] font-bold tracking-widest text-xl">
                YANTRA CONFIGURATION
              </h2>
              <p className="text-[#45A29E] text-xs font-mono mt-1">
                AI SUBSYSTEM CONTROLS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-[#FF9933] transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
          {/* Column 1: Core Toggles */}
          <div className="space-y-6">
            <h3 className="text-white/60 tracking-widest border-b border-white/10 pb-2 mb-4 text-xs">
              ACTIVE MODULES
            </h3>

            <div className="flex justify-between items-center bg-black/40 p-3 border-l-2 border-[#FF9933]">
              <span className="text-white">VYUHA OPTICS (Object Det.)</span>
              <div className="w-10 h-5 bg-[#FF9933]/20 rounded-full relative shadow-[0_0_10px_rgba(255,153,51,0.2)]">
                <div className="absolute right-1 top-1 w-3 h-3 bg-[#FF9933] rounded-full" />
              </div>
            </div>

            <div className="flex justify-between items-center bg-black/40 p-3 border-l-2 border-white/20 opacity-50">
              <span className="text-white">FACE MESH (468 Points)</span>
              <div className="w-10 h-5 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white/50 rounded-full" />
              </div>
            </div>

            <div className="flex justify-between items-center bg-black/40 p-3 border-l-2 border-white/20 opacity-50">
              <span className="text-white">POSE ESTIMATION</span>
              <div className="w-10 h-5 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>

          {/* Column 2: Parameters */}
          <div className="space-y-6">
            <h3 className="text-white/60 tracking-widest border-b border-white/10 pb-2 mb-4 text-xs">
              VYUHA PARAMETERS
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#45A29E]">CONFIDENCE THRESHOLD</span>
                <span className="text-[#FF9933] font-bold">50%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                defaultValue="50"
                className="w-full accent-[#FF9933] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[9px] text-white/40 mt-2">
                Higher values reduce false positives but may miss objects.
              </p>
            </div>

            <div className="pt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#45A29E]">MAX TRACKED OBJECTS</span>
                <span className="text-[#FF9933] font-bold">5</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                className="w-full accent-[#FF9933] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-4 border-t border-[#FF9933]/20 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white/60 hover:text-white text-xs font-bold tracking-widest transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#FF9933] text-black text-xs font-bold tracking-widest hover:bg-[#FF9933]/80 transition-colors shadow-[0_0_15px_rgba(255,153,51,0.4)]"
          >
            APPLY PROTOCOLS
          </button>
        </div>
      </div>
    </div>
  )
}
