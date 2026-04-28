import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobs = await prisma.job.findMany({ orderBy: { submittedAt: "desc" } });
  return Response.json(jobs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const job = await prisma.job.create({
    data: {
      client: body.client,
      address: body.address,
      type: Array.isArray(body.type) ? body.type[0] : body.type,
      sqft: Number(body.sqft),
      value: 0,
      status: "Site Visit Submitted",
      fieldRep: "Jovan M.",
      services: JSON.stringify(body.services || []),
      urgent: false,
      notes: body.notes || null,
      billingName: body.billingName || null,
      billingEmail: body.billingEmail || null,
    },
  });
  return Response.json(job, { status: 201 });
}
