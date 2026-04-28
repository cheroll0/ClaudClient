"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import JovanForm from "@/components/JovanForm";
import MoonDashboard from "@/components/MoonDashboard";
import MarthaDashboard from "@/components/MarthaDashboard";

type Tab = "jovan" | "moon" | "martha";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("jovan");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto py-4">
        {activeTab === "jovan" && <JovanForm />}
        {activeTab === "moon" && <MoonDashboard />}
        {activeTab === "martha" && <MarthaDashboard />}
      </main>
    </div>
  );
}
