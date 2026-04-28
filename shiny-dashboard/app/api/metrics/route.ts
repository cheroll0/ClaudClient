import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobs = await prisma.job.findMany();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const submittedToday = jobs.filter((j) => new Date(j.submittedAt) >= todayStart).length;
  const submittedYesterday = jobs.filter(
    (j) => new Date(j.submittedAt) >= yesterdayStart && new Date(j.submittedAt) < todayStart
  ).length;

  const estimatesSentThisWeek = jobs.filter(
    (j) => j.status === "Estimate Sent" && new Date(j.submittedAt) >= weekStart
  ).length;

  const openStatuses = ["Site Visit Submitted", "AI Analysis in Progress", "Pending Moon Review", "Estimate Sent", "Follow-Up"];
  const openJobs = jobs.filter((j) => openStatuses.includes(j.status));
  const pipelineValue = openJobs.reduce((sum, j) => sum + j.value, 0);

  const last30Jobs = jobs.filter((j) => new Date(j.submittedAt) >= thirtyDaysAgo);
  const closedWon = last30Jobs.filter((j) => j.status === "Closed Won").length;
  const closedLost = last30Jobs.filter((j) => j.status === "Closed Lost").length;
  const closeRate = closedWon + closedLost > 0 ? Math.round((closedWon / (closedWon + closedLost)) * 100) : 0;

  const sentJobs = jobs.filter((j) => j.status === "Estimate Sent");
  const avgDealSize = sentJobs.length > 0
    ? Math.round(sentJobs.reduce((sum, j) => sum + j.value, 0) / sentJobs.length)
    : 0;

  return Response.json({
    submittedToday,
    submittedTodayDelta: submittedToday - submittedYesterday,
    estimatesSentThisWeek,
    pipelineValue: Math.round(pipelineValue),
    closeRate,
    avgTimeToSend: 47,
    avgDealSize,
  });
}
