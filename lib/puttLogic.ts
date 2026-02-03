/**
 * Putt calculation: make-% and 3-putt % lookup, then rollPutts (1–4).
 * P(1) from make-%, P(3) from 3-putt table (exact 3-putts only).
 * Remainder (1 - p1 - p3) = P(2) + P(4); split with P(4) small and scaling by handicap.
 */

import type { HandicapPreset } from "@/types/putt";
import {
	type HandicapIndex,
	MAKE_PCT_TABLE,
	THREE_PUTT_TABLE,
	getMakePctBandIndex,
	getThreePuttBandIndex
} from "./presets";

const HANDICAPS: HandicapIndex[] = [0, 5, 10, 15, 20, 25];

function toHandicapIndex(preset: HandicapPreset): HandicapIndex {
	if (HANDICAPS.includes(preset as HandicapIndex)) return preset as HandicapIndex;
	return 10;
}

/**
 * Fraction of the (2|4) remainder that becomes 4-putt.
 * Scales with handicap (higher HCP → more 4-putts) and distance (longer → more 4-putts).
 */
function getFourPuttFractionOfRemainder(
	h: HandicapIndex,
	distanceFeet: number
): number {
	const baseByHcp: Record<HandicapIndex, number> = {
		0: 0.02,
		5: 0.04,
		10: 0.06,
		15: 0.08,
		20: 0.11,
		25: 0.14
	};
	const base = baseByHcp[h] ?? 0.06;
	// Distance boost: 1.0x at 0–20 ft, ramps to 1.6x at 60+ ft (long putts = more 4-putts)
	const distanceMultiplier =
		distanceFeet <= 20 ? 1 : 1 + 0.6 * Math.min(1, (distanceFeet - 20) / 40);
	const frac = base * distanceMultiplier;
	return Math.min(frac, 0.32); // cap so remainder doesn't collapse
}

export function getMakePctForDistance(
	distanceFeet: number,
	handicapPreset: HandicapPreset
): number {
	const bi = getMakePctBandIndex(distanceFeet);
	const h = toHandicapIndex(handicapPreset);
	const row = MAKE_PCT_TABLE[h];
	return (row?.[bi] ?? 50) / 100;
}

export function getThreePuttPctForDistance(
	distanceFeet: number,
	handicapPreset: HandicapPreset
): number {
	const bi = getThreePuttBandIndex(distanceFeet);
	const h = toHandicapIndex(handicapPreset);
	const row = THREE_PUTT_TABLE[h];
	return (row?.[bi] ?? 15) / 100;
}

/**
 * P(1) = make%, P(3) = 3-putt% (exact). Remainder = P(2) + P(4).
 * Split remainder: P(4) = remainder × fourPuttFraction(h, distance), P(2) = remainder - P(4).
 */
export function rollPutts(distanceFeet: number, handicapPreset: HandicapPreset): 1 | 2 | 3 | 4 {
	const h = toHandicapIndex(handicapPreset);
	const p1 = getMakePctForDistance(distanceFeet, handicapPreset);
	const p3 = getThreePuttPctForDistance(distanceFeet, handicapPreset);
	const remainder = Math.max(0, 1 - p1 - p3);
	const fourPuttFrac = getFourPuttFractionOfRemainder(h, distanceFeet);
	const p4 = remainder * fourPuttFrac;
	const p2 = remainder - p4;
	const r = Math.random();
	if (r < p1) return 1;
	if (r < p1 + p2) return 2;
	if (r < p1 + p2 + p3) return 3;
	return 4;
}
