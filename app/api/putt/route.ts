import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rollPutts, getMakePctForDistance } from "@/lib/puttLogic";
import type { HandicapPreset } from "@/types/putt";

const HISTORY_CAP = 100;

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const distanceFeet = Number(body?.distanceFeet);
		const preset = body?.preset as HandicapPreset | undefined;
		if (
			typeof distanceFeet !== "number" ||
			!Number.isFinite(distanceFeet) ||
			distanceFeet < 0
		) {
			return NextResponse.json(
				{ error: "distanceFeet required and must be a non-negative number" },
				{ status: 400 }
			);
		}

		const h = (
			preset != null && [0, 5, 10, 15, 20, 25].includes(Number(preset)) ? Number(preset) : 10
		) as HandicapPreset;

		const putts = rollPutts(distanceFeet, h);
		const makePctUsed = getMakePctForDistance(distanceFeet, h);
		const session = await auth();

		if (session?.user?.id) {
			await prisma.puttHistory.create({
				data: {
					userId: session.user.id,
					distanceFeet,
					putts,
					handicapPreset: h
				}
			});

			const count = await prisma.puttHistory.count({
				where: { userId: session.user.id }
			});

			if (count > HISTORY_CAP) {
				const oldest = await prisma.puttHistory.findMany({
					where: { userId: session.user.id },
					orderBy: { createdAt: "asc" },
					take: count - HISTORY_CAP,
					select: { id: true }
				});
				if (oldest.length) {
					await prisma.puttHistory.deleteMany({
						where: { id: { in: oldest.map((o) => o.id) } }
					});
				}
			}
		}

		return NextResponse.json({
			putts,
			makePctUsed: Math.round(makePctUsed * 100) / 100
		});
	} catch (e) {
		console.error("putt error", e);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
