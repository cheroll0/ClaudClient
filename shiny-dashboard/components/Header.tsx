"use client";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#1B4F8A" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-bold leading-tight" style={{ color: "#1B4F8A" }}>
            Shiny Cleaning Agency
          </div>
          <div className="text-[10px] text-gray-400 leading-tight">
            Estimate Dashboard · BrightPeak AI
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#DCFCE7", color: "#166534" }}
        >
          ● Live
        </span>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#F3F4F6", color: "#374151" }}
        >
          GHL Connected
        </span>
      </div>
    </header>
  );
}
