interface BottomConsoleProps {
  objectCount: number
  isListening: boolean
  transcript: string
  aiResponse: string
  onMicClick: () => void
}

export default function BottomConsole({
  objectCount,
  isListening,
  transcript,
  aiResponse,
  onMicClick,
}: BottomConsoleProps) {
  return (
    <div className="mt-auto w-full flex flex-col items-center pb-4 pointer-events-auto z-20">
      {/* AI Voice Dock */}
      <div className="bg-[#0B0C10]/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 md:p-4 w-full md:w-[600px] flex items-center justify-between mb-4 md:mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          {/* AI Avatar Icon - Changes color and pulses when listening */}
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors duration-300 ${isListening ? "border-[#45A29E] bg-[#45A29E]/20" : "border-[#FF9933]/50 bg-[#FF9933]/5"}`}
          >
            <div
              className={`w-4 h-4 md:w-5 md:h-5 rounded-[4px] opacity-80 ${isListening ? "bg-[#45A29E] animate-ping" : "bg-[#FF9933]"}`}
            />
          </div>

          {/* AI Text Readout */}
          <div className="flex-1 overflow-hidden">
            <h3 className="text-white font-bold text-[10px] md:text-xs tracking-widest">
              DRISHTI_AI
            </h3>
            {/* Show what the user is saying if listening, otherwise show AI response */}
            <p
              className={`${isListening ? "text-[#FF9933]" : "text-[#45A29E]"} text-[8px] md:text-[10px] mt-0.5 md:mt-1 font-mono truncate`}
            >
              {isListening && transcript ? `> ${transcript}` : aiResponse}
            </p>
          </div>
        </div>

        {/* Audio Visualizer - Animates randomly when listening, static pattern otherwise */}
        <div className="flex items-center gap-[2px] md:gap-[3px] h-6 md:h-8 mx-4">
          {[40, 70, 30, 90, 50, 80, 20, 60].map((h, i) => (
            <div
              key={i}
              className={`w-[2px] md:w-[3px] rounded-full opacity-80 transition-all duration-75 ${isListening ? "bg-[#45A29E]" : "bg-gradient-to-t from-[#45A29E] to-[#FF9933]"}`}
              style={{
                height: isListening
                  ? `${Math.floor(Math.random() * 80) + 20}%`
                  : `${h}%`,
              }}
            />
          ))}
        </div>

        {/* Microphone Action Button */}
        <button
          onClick={onMicClick}
          className={`${isListening ? "bg-[#45A29E] shadow-[0_0_15px_rgba(69,162,158,0.6)]" : "bg-[#FF9933] hover:bg-[#FF9933]/80 shadow-[0_0_15px_rgba(255,153,51,0.4)]"} text-black p-2 md:p-3 rounded-md transition-all ml-2`}
        >
          {isListening ? (
            <svg
              className="w-4 h-4 md:w-5 md:h-5 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Bottom Nav Circular Icons */}
      <div className="flex items-end gap-4 md:gap-6 text-white/50 text-[7px] md:text-[8px] font-bold tracking-widest text-center">
        <div className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer hover:text-white transition-colors">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10">
            🔍
          </div>
          SCAN
        </div>
        <div className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer hover:text-white transition-colors">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10">
            🧭
          </div>
          NAV
        </div>

        {/* Active Item (MAP) */}
        <div className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer text-[#FF9933]">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#FF9933] bg-[#FF9933]/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,153,51,0.2)] text-base md:text-lg">
            🗺️
          </div>
          MAP
        </div>

        <div className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer hover:text-white transition-colors">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10">
            ⚙️
          </div>
          AI
        </div>
        <div className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer hover:text-white transition-colors">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10">
            👁️
          </div>
          HUD
        </div>
      </div>
    </div>
  )
}
