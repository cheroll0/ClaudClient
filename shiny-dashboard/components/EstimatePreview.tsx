"use client";

import { type EstimateLineItem, formatPrice } from "@/lib/pricing";

interface Job {
  id: number;
  client: string;
  address: string;
  type: string;
  sqft: number;
  billingName?: string | null;
  billingEmail?: string | null;
}

interface Props {
  job: Job;
  items: EstimateLineItem[];
  total: number;
  serviceDescription?: string;
  onApprove: () => void;
  onBack: () => void;
  saving?: boolean;
}

export default function EstimatePreview({ job, items, total, serviceDescription, onApprove, onBack, saving }: Props) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Action bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[13px] text-gray-500 flex items-center gap-1 hover:text-gray-700">
          ← Edit estimate
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 bg-white"
          >
            Print / Save PDF
          </button>
          <button
            onClick={onApprove}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-white text-[13px] font-medium disabled:opacity-50"
            style={{ backgroundColor: "#2E8B7A" }}
          >
            {saving ? "Sending..." : "Approve & Send ↗"}
          </button>
        </div>
      </div>

      {/* Estimate document */}
      <div
        id="estimate-doc"
        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {/* Header */}
        <div className="p-8 pb-4" style={{ borderBottom: "2px solid #1B4F8A" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[22px] font-bold tracking-tight" style={{ color: "#1B4F8A" }}>
                Shiny Cleaning Agency
              </div>
              <div className="text-[12px] text-gray-500 mt-1 space-y-0.5">
                <div>140 Lincoln Avenue, Hawthorne NJ 07506</div>
                <div>201-877-4528 · invoices@shinycleaningagency.com</div>
                <div>www.shinycleaningagency.com</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Estimate</div>
              <div className="text-[12px] text-gray-500 mt-1">{today}</div>
              <div className="text-[12px] text-gray-500">EST-{job.id.toString().padStart(4, "0")}</div>
            </div>
          </div>
        </div>

        {/* Client info */}
        <div className="px-8 py-5 bg-gray-50" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Prepared For</div>
          <div className="text-[15px] font-bold text-gray-900">{job.client}</div>
          <div className="text-[13px] text-gray-500 mt-0.5">{job.address}</div>
          {job.billingName && (
            <div className="text-[13px] text-gray-500">Attn: {job.billingName}</div>
          )}
          {job.billingEmail && (
            <div className="text-[13px] text-gray-500">{job.billingEmail}</div>
          )}
          <div className="text-[12px] text-gray-400 mt-1">{job.type} · {job.sqft.toLocaleString()} sq ft</div>
        </div>

        {/* Service line items */}
        <div className="px-8 py-5">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2">Service</th>
                <th className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 w-12">Qty</th>
                <th className="text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 w-24">Unit Price</th>
                <th className="text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td className="py-2.5 pr-4">
                    <div className="text-[13px] text-gray-900">{item.name}</div>
                    {item.note && (
                      <div className="text-[11px] text-gray-400 mt-0.5">{item.note}</div>
                    )}
                  </td>
                  <td className="py-2.5 text-center text-[13px] text-gray-500">{item.qty}</td>
                  <td className="py-2.5 text-right text-[13px] text-gray-500">{formatPrice(item.unitPrice)}</td>
                  <td className="py-2.5 text-right text-[13px] font-medium text-gray-900">{formatPrice(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-4 text-right text-[13px] font-bold text-gray-700 pr-4">Subtotal</td>
                <td className="pt-4 text-right text-[15px] font-bold" style={{ color: "#1B4F8A" }}>
                  {formatPrice(total)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="pb-1 text-right text-[12px] text-gray-400 pr-4">Tax (if applicable)</td>
                <td className="pb-1 text-right text-[12px] text-gray-400">TBD</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Scope description */}
        {serviceDescription && (
          <div className="px-8 py-4" style={{ borderTop: "1px solid #E5E7EB" }}>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Scope of Work</div>
            <p className="text-[12px] text-gray-600 leading-relaxed">{serviceDescription}</p>
          </div>
        )}

        {/* Terms */}
        <div className="px-8 py-5 bg-gray-50" style={{ borderTop: "1px solid #E5E7EB" }}>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Terms & Conditions</div>
          <div className="space-y-2 text-[11px] text-gray-500 leading-relaxed">
            <p><span className="font-semibold text-gray-700">Payment:</span> Due on the 1st of each month. A late fee will be applied if payment is not received within 10 days.</p>
            <p><span className="font-semibold text-gray-700">Late Fee:</span> $50 or 20% of the total service amount, whichever is higher, applied from day 11.</p>
            <p><span className="font-semibold text-gray-700">Cancellation:</span> Must be made at least one month in advance.</p>
            <p><span className="font-semibold text-gray-700">Annual Increase:</span> Contract price subject to a 7% annual adjustment (or the current inflation rate if higher).</p>
            <p><span className="font-semibold text-gray-700">Non-Exclusivity:</span> Client agrees not to engage contractor's employees directly for at least 2 years after contract cancellation.</p>
            <p><span className="font-semibold text-gray-700">Governing Law:</span> State of New Jersey, USA.</p>
          </div>
        </div>

        {/* Signature block */}
        <div className="px-8 py-6" style={{ borderTop: "1px solid #E5E7EB" }}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[11px] text-gray-400 mb-6">Authorized by Shiny Cleaning Agency</div>
              <div style={{ borderTop: "1px solid #9CA3AF" }} className="pt-2">
                <div className="text-[11px] text-gray-400">Signature · Date</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400 mb-6">Client Acceptance — {job.client}</div>
              <div style={{ borderTop: "1px solid #9CA3AF" }} className="pt-2">
                <div className="text-[11px] text-gray-400">Signature · Date</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-3 text-center text-[11px] text-gray-400"
          style={{ borderTop: "2px solid #1B4F8A" }}
        >
          Thank you for choosing Shiny Cleaning Agency · invoices@shinycleaningagency.com · 201-877-4528
        </div>
      </div>
    </div>
  );
}
