import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const DEFAULT_LIMIT = 50;

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
    100
  );
  const rows = await prisma.puttHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      distanceFeet: true,
      putts: true,
      handicapPreset: true,
      createdAt: true,
    },
  });
  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      distanceFeet: r.distanceFeet,
      putts: r.putts,
      handicapPreset: r.handicapPreset,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}
