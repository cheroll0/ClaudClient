"use client";

import { useState } from "react";
import {
  RESIDENTIAL_ITEMS,
  COMMERCIAL_MULTIPLIERS,
  calcCommercialBase,
  COMMERCIAL_ADDONS,
  type ServiceTier,
  type EstimateLineItem,
  formatPrice,
} from "@/lib/pricing";

interface Props {
  jobType: string;
  sqft: number;
  initialServices: string[];
  onEstimateChange: (items: EstimateLineItem[], total: number) => void;
}

const SERVICE_TIERS: ServiceTier[] = ["Regular Clean", "Deep Clean", "Move In/Out", "Post Construction"];

const CATEGORIES = ["Rooms", "Bathrooms", "Kitchen", "Windows", "Upholstery", "Add-ons"];

const isCommercial = (type: string) =>
  ["Commercial", "Medical", "School", "Restaurant", "Gym", "Office"].includes(type);

export default function EstimateBuilder({ jobType, sqft, onEstimateChange }: Props) {
  const commercial = isCommercial(jobType);
  const [tier, setTier] = useState<ServiceTier>(
    jobType === "Post-Construction" ? "Post Construction" : "Deep Clean"
  );
  const [commercialType, setCommercialType] = useState(
    jobType === "Medical" ? "Medical / Biohazard" :
    jobType === "Restaurant" ? "Restaurant" :
    jobType === "Post-Construction" ? "Post Construction" :
    "Deep Clean"
  );
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [commercialAddons, setCommercialAddons] = useState<Record<string, boolean>>({});
  const [customLine, setCustomLine] = useState({ name: "", qty: 1, unitPrice: 0 });
  const [customLines, setCustomLines] = useState<EstimateLineItem[]>([]);

  const setQty = (name: string, qty: number) => {
    const next = { ...quantities, [name]: Math.max(0, qty) };
    setQuantities(next);
    recalc(next, commercialAddons, customLines);
  };

  const toggleAddon = (name: string) => {
    const next = { ...commercialAddons, [name]: !commercialAddons[name] };
    setCommercialAddons(next);
    recalc(quantities, next, customLines);
  };

  const addCustomLine = () => {
    if (!customLine.name || customLine.unitPrice <= 0) return;
    const item: EstimateLineItem = {
      name: customLine.name,
      qty: customLine.qty,
      unitPrice: customLine.unitPrice,
      total: customLine.qty * customLine.unitPrice,
    };
    const next = [...customLines, item];
    setCustomLines(next);
    setCustomLine({ name: "", qty: 1, unitPrice: 0 });
    recalc(quantities, commercialAddons, next);
  };

  const removeCustomLine = (i: number) => {
    const next = customLines.filter((_, idx) => idx !== i);
    setCustomLines(next);
    recalc(quantities, commercialAddons, next);
  };

  const recalc = (
    qtys: Record<string, number>,
    addons: Record<string, boolean>,
    customs: EstimateLineItem[]
  ) => {
    const items: EstimateLineItem[] = [];

    if (commercial) {
      const mult = COMMERCIAL_MULTIPLIERS[commercialType] ?? 1.0;
      const base = calcCommercialBase(sqft);
      const baseTotal = Math.round(base.total * mult);
      items.push({
        name: `Base Service — ${commercialType} (${sqft.toLocaleString()} sqft)`,
        qty: 1,
        unitPrice: baseTotal,
        total: baseTotal,
        note: `${sqft.toLocaleString()} sqft ÷ 70 = ${base.hours}h × $120/hr × ${mult}x multiplier`,
      });
      COMMERCIAL_ADDONS.forEach((addon) => {
        if (addons[addon.name]) {
          const price = typeof addon.price === "number"
            ? addon.unit?.includes("sqft") ? Math.round(addon.price * sqft) : addon.price
            : 0;
          items.push({ name: addon.name, qty: 1, unitPrice: price, total: price, note: addon.unit });
        }
      });
    } else {
      RESIDENTIAL_ITEMS.forEach((item) => {
        const qty = qtys[item.name] ?? 0;
        if (qty > 0) {
          const raw = item.prices[tier];
          const unitPrice = typeof raw === "number" ? raw : 0;
          if (unitPrice > 0) {
            items.push({ name: item.name, qty, unitPrice, total: qty * unitPrice });
          }
        }
      });
    }

    customs.forEach((c) => items.push(c));
    const total = items.reduce((s, i) => s + i.total, 0);
    onEstimateChange(items, total);
  };

  // Re-run recalc when tier or commercial type changes
  const handleTierChange = (t: ServiceTier) => {
    setTier(t);
    recalc(quantities, commercialAddons, customLines);
  };

  const handleCommercialTypeChange = (t: string) => {
    setCommercialType(t);
    recalc(quantities, commercialAddons, customLines);
  };

  return (
    <div className="space-y-5">
      {/* Service tier / commercial type selector */}
      {!commercial ? (
        <div>
          <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-2">Service Tier</div>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TIERS.map((t) => (
              <button
                key={t}
                onClick={() => handleTierChange(t)}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors"
                style={{
                  backgroundColor: tier === t ? "#2E8B7A" : "white",
                  color: tier === t ? "white" : "#374151",
                  borderColor: tier === t ? "#2E8B7A" : "#D1D5DB",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-2">Service Type</div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(COMMERCIAL_MULTIPLIERS).map((t) => (
              <button
                key={t}
                onClick={() => handleCommercialTypeChange(t)}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors"
                style={{
                  backgroundColor: commercialType === t ? "#2E8B7A" : "white",
                  color: commercialType === t ? "white" : "#374151",
                  borderColor: commercialType === t ? "#2E8B7A" : "#D1D5DB",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {sqft > 0 && (
            <div
              className="mt-3 p-3 rounded-lg text-[13px]"
              style={{ backgroundColor: "#F0FDF9", color: "#2E8B7A" }}
            >
              <span className="font-bold">{sqft.toLocaleString()} sqft</span> ÷ 70 = {(sqft / 70).toFixed(1)}h ×
              $120/hr × {COMMERCIAL_MULTIPLIERS[commercialType]}x = {" "}
              <span className="font-bold">
                {formatPrice(Math.round((sqft / 70) * 120 * (COMMERCIAL_MULTIPLIERS[commercialType] ?? 1)))}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Residential room-by-room selector */}
      {!commercial && (
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const items = RESIDENTIAL_ITEMS.filter((i) => i.category === cat);
            return (
              <div key={cat}>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{cat}</div>
                <div className="space-y-1">
                  {items.map((item) => {
                    const rawPrice = item.prices[tier];
                    const price = typeof rawPrice === "number" ? rawPrice : null;
                    const qty = quantities[item.name] ?? 0;
                    if (price === 0 && !item.unit) return null;
                    return (
                      <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                        <div className="flex-1">
                          <span className="text-[13px] text-gray-700">{item.name}</span>
                          {item.unit && (
                            <span className="text-[11px] text-gray-400 ml-1">({item.unit})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {price !== null && (
                            <span className="text-[12px] text-gray-400 w-12 text-right">
                              {formatPrice(price)}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setQty(item.name, qty - 1)}
                              className="w-6 h-6 rounded border border-gray-200 text-gray-500 text-[13px] flex items-center justify-center"
                            >−</button>
                            <span className="w-6 text-center text-[13px] font-medium">{qty}</span>
                            <button
                              onClick={() => setQty(item.name, qty + 1)}
                              className="w-6 h-6 rounded border border-gray-200 text-gray-500 text-[13px] flex items-center justify-center"
                              style={{ backgroundColor: qty > 0 ? "#F0FDF9" : undefined }}
                            >+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Commercial add-ons */}
      {commercial && (
        <div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Add-On Services</div>
          <div className="space-y-1">
            {COMMERCIAL_ADDONS.map((addon) => {
              const checked = commercialAddons[addon.name] ?? false;
              const price = typeof addon.price === "number"
                ? addon.unit?.includes("sqft") ? Math.round(addon.price * sqft) : addon.price
                : 0;
              return (
                <button
                  key={addon.name}
                  onClick={() => toggleAddon(addon.name)}
                  className="w-full flex items-center justify-between py-1.5 border-b border-gray-50 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: checked ? "#2E8B7A" : "white",
                        borderColor: checked ? "#2E8B7A" : "#D1D5DB",
                      }}
                    >
                      {checked && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className="text-[13px] text-gray-700">{addon.name}</span>
                    <span className="text-[11px] text-gray-400">{addon.unit}</span>
                  </div>
                  {price > 0 && (
                    <span className="text-[12px] text-gray-400">{formatPrice(price)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom line items */}
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Custom Line Items</div>
        {customLines.map((line, i) => (
          <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-[13px] text-gray-700">{line.name} × {line.qty}</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium">{formatPrice(line.total)}</span>
              <button onClick={() => removeCustomLine(i)} className="text-red-400 text-[12px]">✕</button>
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none"
            placeholder="Service name"
            value={customLine.name}
            onChange={(e) => setCustomLine({ ...customLine, name: e.target.value })}
          />
          <input
            type="number"
            className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none"
            placeholder="Qty"
            value={customLine.qty}
            onChange={(e) => setCustomLine({ ...customLine, qty: Number(e.target.value) })}
          />
          <input
            type="number"
            className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none"
            placeholder="$"
            value={customLine.unitPrice || ""}
            onChange={(e) => setCustomLine({ ...customLine, unitPrice: Number(e.target.value) })}
          />
          <button
            onClick={addCustomLine}
            className="px-3 py-1.5 rounded-lg text-white text-[12px] font-medium"
            style={{ backgroundColor: "#2E8B7A" }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
