"use client";

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import ServiceTag from "./ServiceTag";
import MetricCard from "./MetricCard";

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
}

interface Metrics {
  submittedToday: number;
  submittedTodayDelta: number;
  estimatesSentThisWeek: number;
  pipelineValue: number;
  closeRate: number;
  avgTimeToSend: number;
  avgDealSize: number;
}

const ALL_STATUSES = [
  "All",
  "Site Visit Submitted",
  "AI Analysis in Progress",
  "Pending Moon Review",
  "Estimate Sent",
  "Follow-Up",
  "Closed Won",
  "Closed Lost",
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days <= 7) return `${days} days ago`;
  return "Last week";
}

function parseServices(val: string): string[] {
  try { return JSON.parse(val); } catch { return []; }
}

function getValueColor(status: string): string {
  if (status === "Closed Won") return "#166534";
  if (status === "Closed Lost") return "#991B1B";
  return "#111827";
}

export default function MarthaDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/metrics").then((r) => r.json()),
    ]).then(([jobsData, metricsData]) => {
      setJobs(jobsData);
      setMetrics(metricsData);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "All" ? jobs : jobs.filter((j) => j.status === filter);

  const openStatuses = ["Site Visit Submitted", "AI Analysis in Progress", "Pending Moon Review", "Estimate Sent", "Follow-Up"];
  const openPipelineValue = jobs
    .filter((j) => openStatuses.includes(j.status))
    .reduce((sum, j) => sum + j.value, 0);

  if (loading) {
    return <div className="p-6 text-center text-gray-400 text-[14px]">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-5">
      {/* Metrics grid */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetricCard
            label="Submitted Today"
            value={metrics.submittedToday}
            sub="vs yesterday"
            delta={`${metrics.submittedTodayDelta >= 0 ? "+" : ""}${metrics.submittedTodayDelta} vs yesterday`}
          />
          <MetricCard
            label="Estimates Sent"
            value={metrics.estimatesSentThisWeek}
            sub="This week"
          />
          <MetricCard
            label="Pipeline Value"
            value={`$${metrics.pipelineValue.toLocaleString()}`}
            sub="Open estimates"
          />
          <MetricCard
            label="Close Rate"
            value={`${metrics.closeRate}%`}
            sub="Last 30 days"
          />
          <MetricCard
            label="Avg Time to Send"
            value={`${metrics.avgTimeToSend} min`}
            sub="Form to estimate"
          />
          <MetricCard
            label="Avg Deal Size"
            value={`$${metrics.avgDealSize.toLocaleString()}`}
            sub="Closed won"
          />
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map((s) => {
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: active ? "#1B4F8A" : "#F3F4F6",
                color: active ? "white" : "#374151",
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Pipeline list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-[13px]">No jobs match this filter</div>
        )}
        {filtered.map((job) => {
          const services = parseServices(job.services);
          return (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-bold text-gray-900">{job.client}</span>
                    {job.urgent && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: "#FEEBE9", color: "#B91C1C" }}
                      >
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-gray-400 mt-0.5">
                    {job.address} · {job.sqft.toLocaleString()} sq ft · {job.fieldRep}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
                  <span
                    className="text-[15px] font-bold"
                    style={{ color: getValueColor(job.status) }}
                  >
                    ${job.value.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400">{timeAgo(job.submittedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StatusBadge status={job.status} />
                {services.slice(0, 2).map((s) => <ServiceTag key={s} label={s} />)}
                {services.length > 2 && (
                  <span className="text-[11px] text-gray-400">+{services.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="text-[12px] text-gray-400">Open pipeline</span>
        <span className="text-[14px] font-bold" style={{ color: "#1B4F8A" }}>
          ${Math.round(openPipelineValue).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
