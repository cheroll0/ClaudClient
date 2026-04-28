export default function ServiceTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
      {label}
    </span>
  );
}
