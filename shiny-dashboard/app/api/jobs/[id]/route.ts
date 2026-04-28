import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const job = await prisma.job.update({
    where: { id: Number(id) },
    data: body,
  });
  return Response.json(job);
}
