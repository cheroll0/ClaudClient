interface StatusConfig {
  bg: string;
  text: string;
  dot: string;
  label: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  "Site Visit Submitted": {
    bg: "#E6F1FB",
    text: "#0C447C",
    dot: "#378ADD",
    label: "Site Visit Submitted",
  },
  "AI Analysis in Progress": {
    bg: "#FAEEDA",
    text: "#633806",
    dot: "#EF9F27",
    label: "AI Analysis in Progress",
  },
  "Pending Moon Review": {
    bg: "#FAECE7",
    text: "#4A1B0C",
    dot: "#D85A30",
    label: "Pending Moon Review",
  },
  "Estimate Sent": {
    bg: "#EAF3DE",
    text: "#173404",
    dot: "#639922",
    label: "Estimate Sent",
  },
  "Follow-Up": {
    bg: "#EEEDFE",
    text: "#26215C",
    dot: "#7F77DD",
    label: "Follow-Up",
  },
  "Closed Won": {
    bg: "#E1F5EE",
    text: "#04342C",
    dot: "#1D9E75",
    label: "Closed Won",
  },
  "Closed Lost": {
    bg: "#FCEBEB",
    text: "#501313",
    dot: "#E24B4A",
    label: "Closed Lost",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? {
    bg: "#F3F4F6",
    text: "#374151",
    dot: "#9CA3AF",
    label: status,
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}
