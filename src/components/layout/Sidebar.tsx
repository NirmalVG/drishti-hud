interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { label: "ANALYTICS", icon: "📊" },
    { label: "TELEMETRY", icon: "📈" },
    { label: "YANTRA", icon: "⚙️" },
    { label: "VOICE", icon: "🎤" },
  ]

  return (
    <aside className="absolute left-0 top-20 bottom-0 w-20 border-r border-[#FF9933]/10 flex flex-col items-center py-6 z-30 bg-black/40 backdrop-blur-md hidden md:flex pointer-events-auto">
      {/* ... keeping the Operator avatar the same ... */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-10 h-10 rounded-full border border-[#45A29E] flex items-center justify-center mb-2">
          <div className="w-6 h-6 border border-[#45A29E]/50 rounded-full" />
        </div>
        <span className="text-[#FF9933] text-[8px] font-bold tracking-widest">
          OPERATOR_01
        </span>
        <span className="text-[#45A29E] text-[7px] tracking-widest mt-1">
          PRANA: 100%
        </span>
      </div>

      <nav className="flex flex-col gap-8 flex-1 w-full">
        {menuItems.map((item) => {
          const isActive = activeView === item.label
          return (
            <div
              key={item.label}
              onClick={() => setActiveView(item.label)}
              className={`flex flex-col items-center justify-center w-full py-3 cursor-pointer border-l-2 transition-all ${isActive ? "border-[#FF9933] bg-[#FF9933]/10" : "border-transparent opacity-40 hover:opacity-100"}`}
            >
              <span className={`text-xl mb-1 ${!isActive && "grayscale"}`}>
                {item.icon}
              </span>
              <span
                className={`text-[7px] tracking-widest font-bold ${isActive ? "text-[#FF9933]" : "text-white"}`}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
