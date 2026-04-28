"use client";

type Tab = "jovan" | "moon" | "martha";

interface TabNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "jovan", label: "Field Capture / Jovan" },
  { id: "moon", label: "Estimate Review / Moon" },
  { id: "martha", label: "Pipeline View / Martha" },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 flex gap-0 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors"
            style={{
              color: isActive ? "#1B4F8A" : "#6B7280",
              borderBottom: isActive ? "2px solid #1B4F8A" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
