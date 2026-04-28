"use client";

import { useState } from "react";

const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Medical",
  "Airbnb",
  "Post-Construction",
  "School",
  "Restaurant",
  "Office",
];

const COMMERCIAL_TYPES = new Set(["Commercial", "Medical", "School", "Restaurant"]);

const SERVICES = [
  "Deep Clean",
  "Carpet Cleaning",
  "Window Washing",
  "Mold Remediation",
  "Post-Construction",
  "Floor Polishing",
  "Power Washing",
  "Grout Cleaning",
  "Upholstery",
  "Junk Removal",
  "Graffiti Removal",
  "Packing Services",
];

const CONDITIONS = [
  { value: "Light Maintenance", desc: "Minor touch-ups needed" },
  { value: "Moderate", desc: "Standard cleaning required" },
  { value: "Heavy", desc: "Deep cleaning required" },
  { value: "Post-Construction", desc: "Construction debris present" },
  { value: "Hazmat Adjacent", desc: "Specialized handling needed" },
];

interface FormData {
  client: string;
  address: string;
  propertyTypes: string[];
  billingName: string;
  billingEmail: string;
  sqft: string;
  floors: string;
  condition: string;
  frequency: string;
  services: string[];
  notes: string;
  photos: File[];
  video: File | null;
}

const INITIAL_FORM: FormData = {
  client: "",
  address: "",
  propertyTypes: [],
  billingName: "",
  billingEmail: "",
  sqft: "",
  floors: "",
  condition: "",
  frequency: "",
  services: [],
  notes: "",
  photos: [],
  video: null,
};

export default function JovanForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ client: string; sqft: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const needsBilling = form.propertyTypes.some((t) => COMMERCIAL_TYPES.has(t));
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const canContinue = () => {
    if (step === 1) return form.client.trim() && form.address.trim() && form.propertyTypes.length > 0;
    if (step === 2) return form.sqft && form.floors && form.condition && form.frequency;
    if (step === 3) return form.services.length > 0;
    if (step === 4) return form.photos.length >= 3;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: form.client,
          address: form.address,
          type: form.propertyTypes,
          sqft: form.sqft,
          services: form.services,
          notes: form.notes,
          billingName: needsBilling ? form.billingName : null,
          billingEmail: needsBilling ? form.billingEmail : null,
          floors: form.floors,
          condition: form.condition,
          frequency: form.frequency,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmittedData({ client: form.client, sqft: form.sqft });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && submittedData) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#DCFCE7" }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16l7 7 13-13"
              stroke="#166534"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Assessment Submitted!</h2>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">{submittedData.client}</span> ·{" "}
          {Number(submittedData.sqft).toLocaleString()} sq ft
        </p>
        <p className="text-[13px] text-gray-500 mb-1">Moon notified. AI analysis underway.</p>
        <button
          onClick={() => {
            setForm(INITIAL_FORM);
            setStep(1);
            setSubmitted(false);
            setSubmittedData(null);
          }}
          className="mt-6 px-6 py-2.5 rounded-lg text-white text-[14px] font-medium"
          style={{ backgroundColor: "#2E8B7A" }}
        >
          New Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] text-gray-400">Step {step} of {totalSteps}</span>
          <span className="text-[12px] text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: "#2E8B7A" }}
          />
        </div>
      </div>

      {/* Step 1: Job Basics */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Job Basics</h2>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Client Name</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-teal-500"
              style={{ "--tw-ring-color": "#2E8B7A" } as React.CSSProperties}
              placeholder="Full name or business name"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Property Address</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none"
              placeholder="123 Main St, Newark, NJ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => {
                const selected = form.propertyTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() =>
                      setForm({ ...form, propertyTypes: toggleItem(form.propertyTypes, type) })
                    }
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors"
                    style={{
                      backgroundColor: selected ? "#2E8B7A" : "white",
                      color: selected ? "white" : "#374151",
                      borderColor: selected ? "#2E8B7A" : "#D1D5DB",
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {needsBilling && (
            <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: "#F0FDF4" }}>
              <p className="text-[12px] font-medium" style={{ color: "#166534" }}>
                Commercial billing contact required
              </p>
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-gray-700">Billing Contact Name</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none bg-white"
                  placeholder="Contact name"
                  value={form.billingName}
                  onChange={(e) => setForm({ ...form, billingName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-gray-700">Billing Contact Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none bg-white"
                  placeholder="billing@company.com"
                  value={form.billingEmail}
                  onChange={(e) => setForm({ ...form, billingEmail: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Property Details */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Property Details</h2>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Square Footage</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none"
              placeholder="e.g. 2400"
              value={form.sqft}
              onChange={(e) => setForm({ ...form, sqft: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Number of Floors</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none bg-white"
              value={form.floors}
              onChange={(e) => setForm({ ...form, floors: e.target.value })}
            >
              <option value="">Select floors</option>
              {["1", "2", "3", "4+"].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Overall Condition</label>
            <div className="space-y-2">
              {CONDITIONS.map((c) => {
                const selected = form.condition === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setForm({ ...form, condition: c.value })}
                    className="w-full text-left p-3 rounded-lg border transition-colors"
                    style={{
                      borderColor: selected ? "#2E8B7A" : "#E5E7EB",
                      backgroundColor: selected ? "#F0FDF9" : "white",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium text-gray-900">{c.value}</span>
                      {selected && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#2E8B7A" }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-gray-400 mt-0.5">{c.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Service Frequency</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none bg-white"
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            >
              <option value="">Select frequency</option>
              {["One-Time", "Weekly", "Biweekly", "Monthly", "Quarterly"].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Services */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Services Required</h2>
          <div className="grid grid-cols-2 gap-2">
            {SERVICES.map((svc) => {
              const selected = form.services.includes(svc);
              return (
                <button
                  key={svc}
                  onClick={() => setForm({ ...form, services: toggleItem(form.services, svc) })}
                  className="p-3 rounded-lg border text-left text-[13px] font-medium transition-colors"
                  style={{
                    borderColor: selected ? "#2E8B7A" : "#E5E7EB",
                    backgroundColor: selected ? "#F0FDF9" : "white",
                    color: selected ? "#2E8B7A" : "#374151",
                  }}
                >
                  {selected && (
                    <span className="mr-1" style={{ color: "#2E8B7A" }}>✓ </span>
                  )}
                  {svc}
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Additional Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none resize-none"
              rows={4}
              placeholder="Any special instructions, access info, or concerns..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Step 4: Upload & Submit */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Upload & Submit</h2>

          {/* Photo upload */}
          <div>
            <label className="text-[13px] font-medium text-gray-700 block mb-2">
              Property Photos <span className="text-red-400">*</span>{" "}
              <span className="text-gray-400 font-normal">(min 3)</span>
            </label>
            <label
              className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors"
              style={{
                borderColor: form.photos.length >= 3 ? "#2E8B7A" : "#D1D5DB",
                backgroundColor: form.photos.length >= 3 ? "#F0FDF9" : "#FAFAFA",
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setForm({ ...form, photos: [...form.photos, ...files] });
                }}
              />
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2">
                <path d="M6 22l6-8 4 5 4-4 6 7" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="2" stroke="#9CA3AF" strokeWidth="1.5" />
                <rect x="3" y="5" width="26" height="22" rx="2" stroke="#9CA3AF" strokeWidth="1.5" />
              </svg>
              {form.photos.length > 0 ? (
                <span className="text-[14px] font-medium" style={{ color: "#2E8B7A" }}>
                  {form.photos.length} photo{form.photos.length !== 1 ? "s" : ""} selected
                  {form.photos.length < 3 && (
                    <span className="text-amber-500"> (need {3 - form.photos.length} more)</span>
                  )}
                </span>
              ) : (
                <span className="text-[13px] text-gray-400">Tap to upload photos</span>
              )}
            </label>
          </div>

          {/* Video upload */}
          <div>
            <label className="text-[13px] font-medium text-gray-700 block mb-2">
              Walkthrough Video <span className="text-gray-400 font-normal">(max 500MB)</span>
            </label>
            <label
              className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 cursor-pointer"
              style={{ borderColor: "#D1D5DB", backgroundColor: "#FAFAFA" }}
            >
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setForm({ ...form, video: file });
                }}
              />
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2">
                <path d="M20 14l7-4v12l-7-4V14z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round" />
                <rect x="3" y="8" width="18" height="16" rx="2" stroke="#9CA3AF" strokeWidth="1.5" />
              </svg>
              <span className="text-[13px] text-gray-400">
                {form.video ? form.video.name : "Tap to upload video"}
              </span>
            </label>
          </div>

          {/* Summary card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Summary</h3>
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Client</span>
                <span className="font-medium text-gray-900">{form.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Address</span>
                <span className="font-medium text-gray-900 text-right max-w-[200px]">{form.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className="font-medium text-gray-900">{form.propertyTypes.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sq Ft</span>
                <span className="font-medium text-gray-900">{Number(form.sqft).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Condition</span>
                <span className="font-medium text-gray-900">{form.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Frequency</span>
                <span className="font-medium text-gray-900">{form.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Services</span>
                <span className="font-medium text-gray-900 text-right max-w-[200px]">
                  {form.services.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-red-500">{error}</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 gap-3">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-[14px] font-medium text-gray-600 bg-white"
          >
            Back
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canContinue()}
            className="flex-1 py-2.5 rounded-lg text-white text-[14px] font-medium transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "#2E8B7A" }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canContinue() || loading}
            className="flex-1 py-2.5 rounded-lg text-white text-[14px] font-medium transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "#2E8B7A" }}
          >
            {loading ? "Submitting..." : "Submit Assessment"}
          </button>
        )}
      </div>
    </div>
  );
}
