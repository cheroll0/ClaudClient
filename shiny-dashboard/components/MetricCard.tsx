interface MetricCardProps {
  label: string;
  value: string | number;
  sub: string;
  delta?: string;
}

export default function MetricCard({ label, value, sub, delta }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {delta && (
          <span
            className="text-[12px] font-medium mb-0.5"
            style={{ color: delta.startsWith("+") ? "#166534" : "#991B1B" }}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="text-[12px] text-gray-400 mt-0.5">{sub}</div>
    </div>
  );
}
