export default function TopHeader() {
  return (
    <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
      <div className="flex items-center gap-6">
        <h1 className="text-[#FF9933] text-2xl font-black tracking-widest flex items-center">
          DRISHTI<span className="text-white/80 font-light ml-1">HUD</span>
        </h1>
        <nav className="hidden md:flex gap-6 text-xs font-bold tracking-widest text-[#FF9933]/50 pointer-events-auto">
          <span className="text-[#FF9933] border-b-2 border-[#FF9933] pb-1 cursor-pointer">
            KAVACH
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            VYUHA
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            SYSTEM
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-4 text-[#45A29E] pointer-events-auto">
        <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center cursor-pointer hover:bg-[#45A29E]/20" />
        <div className="w-5 h-5 rounded-full border-2 border-[#FF9933] cursor-pointer hover:bg-[#FF9933]/20" />
        <div className="w-8 h-8 rounded-full border border-[#45A29E] bg-[#45A29E]/20 ml-2" />
      </div>
    </header>
  )
}
