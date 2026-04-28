"use client";

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import ServiceTag from "./ServiceTag";

interface Job {
  id: number;
  client: string;
  address: string;
  type: string;
  sqft: number;
  value: number;
  status: string;
  fieldRep: string;
  submittedAt: string;
  services: string;
  urgent: boolean;
  aiSummary: string | null;
  aiFlags: string | null;
  hours: number | null;
  basePrice: number | null;
  addons: number | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function parseJSON(val: string | null): string[] {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
}

export default function MoonDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const pending = jobs.filter((j) => j.status === "Pending Moon Review");
  const recentlySent = jobs.filter((j) => j.status === "Estimate Sent");

  const handleApprove = async (job: Job) => {
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Estimate Sent" }),
    });
    await fetchJobs();
    setSelected(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400 text-[14px]">Loading...</div>
    );
  }

  if (selected) {
    const services = parseJSON(selected.services);
    const flags = parseJSON(selected.aiFlags);
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="text-[13px] text-gray-500 flex items-center gap-1 hover:text-gray-700"
        >
          ← Back to queue
        </button>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{selected.client}</h2>
          {selected.urgent && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: "#FEEBE9", color: "#B91C1C" }}>
              Urgent
            </span>
          )}
        </div>

        {/* 2-column grid: client + scope */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Client</div>
            <div className="text-[14px] font-bold text-gray-900">{selected.client}</div>
            <div className="text-[12px] text-gray-400">{selected.address}</div>
            <div className="text-[12px] text-gray-500 mt-1">{selected.type}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Scope</div>
            <div className="text-[14px] font-bold text-gray-900">
              {selected.sqft.toLocaleString()} sq ft
            </div>
            <div className="flex flex-wrap gap-1">
              {services.map((s) => <ServiceTag key={s} label={s} />)}
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div
          className="bg-white border border-gray-200 rounded-xl p-4 border-l-4"
          style={{ borderLeftColor: "#2E8B7A" }}
        >
          <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "#2E8B7A" }}>
            AI Analysis
          </div>
          <p className="text-[13px] text-gray-700 leading-relaxed">{selected.aiSummary}</p>
          {flags.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Flagged items</div>
              {flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                  <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                  {flag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estimate Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-3">
            Estimate Breakdown
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Base service</span>
              <span className="font-medium">${(selected.basePrice ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Add-ons & specialty</span>
              <span className="font-medium">${(selected.addons ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Estimated hours</span>
              <span className="font-medium">{selected.hours ?? 0}h</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="text-[14px] font-bold text-gray-900">Total Estimate</span>
              <span className="text-[16px] font-bold" style={{ color: "#166534" }}>
                ${selected.value.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleApprove(selected)}
            className="flex-1 py-2.5 rounded-lg text-white text-[14px] font-medium"
            style={{ backgroundColor: "#2E8B7A" }}
          >
            Approve & Send ↗
          </button>
          <button
            className="flex-1 py-2.5 rounded-lg text-[14px] font-medium border border-gray-200 text-gray-700 bg-white"
          >
            Adjust Estimate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Pending Review Queue */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-[15px] font-bold text-gray-900">Pending Review Queue</h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500">
            {pending.length}
          </span>
        </div>
        <p className="text-[12px] text-gray-400 mb-3">
          {pending.length} pending review{pending.length !== 1 ? "s" : ""} · sorted by urgency
        </p>
        {pending.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-[13px]">No pending reviews</div>
        ) : (
          <div className="space-y-2">
            {[...pending].sort((a, b) => Number(b.urgent) - Number(a.urgent)).map((job) => {
              const services = parseJSON(job.services);
              return (
                <button
                  key={job.id}
                  onClick={() => setSelected(job)}
                  className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 border-l-4 transition-shadow hover:shadow-sm"
                  style={{ borderLeftColor: job.urgent ? "#EF4444" : "#2E8B7A" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-gray-900">{job.client}</span>
                        {job.urgent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: "#FEEBE9", color: "#B91C1C" }}>
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-gray-400 mt-0.5">{job.address}</div>
                    </div>
                    <div className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{timeAgo(job.submittedAt)}</div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1">
                      {services.slice(0, 3).map((s) => <ServiceTag key={s} label={s} />)}
                    </div>
                    <span className="text-[14px] font-bold ml-2" style={{ color: "#166534" }}>
                      ${job.value.toLocaleString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Recently Sent */}
      {recentlySent.length > 0 && (
        <section>
          <h2 className="text-[15px] font-bold text-gray-900 mb-3">Recently Sent</h2>
          <div className="space-y-2 opacity-75">
            {recentlySent.map((job) => {
              const services = parseJSON(job.services);
              return (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[14px] font-bold text-gray-900">{job.client}</div>
                      <div className="text-[12px] text-gray-400 mt-0.5">{job.address}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <StatusBadge status="Estimate Sent" />
                      <span className="text-[14px] font-bold" style={{ color: "#166534" }}>
                        ${job.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {services.slice(0, 3).map((s) => <ServiceTag key={s} label={s} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
