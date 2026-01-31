import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const row = await prisma.userPuttSettings.findUnique({
    where: { userId: session.user.id },
  });
  return NextResponse.json({
    handicapPreset: row?.handicapPreset ?? null,
    customPercentages: row?.customPercentages ?? null,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const handicapPreset = body?.handicapPreset as number | null | undefined;
    const customPercentages = body?.customPercentages;
    const data: { handicapPreset?: number | null; customPercentages?: unknown } = {};
    if (handicapPreset !== undefined) {
      const n = Number(handicapPreset);
      data.handicapPreset = Number.isInteger(n) && [0, 5, 10, 15, 20, 25].includes(n) ? n : null;
    }
    if (customPercentages !== undefined) data.customPercentages = customPercentages;
    await prisma.userPuttSettings.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...data },
      update: data,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("settings put error", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
