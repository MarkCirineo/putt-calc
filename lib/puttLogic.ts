/**
 * Putt calculation: make-% and 3-putt % lookup, then rollPutts (1–4+).
 * Implements Option A (direct): P(1) from make-%, P(3+) from 3-putt %, P(2) = remainder.
 */

import type { HandicapPreset } from "@/types/putt";
import {
  type HandicapIndex,
  MAKE_PCT_TABLE,
  THREE_PUTT_TABLE,
  getMakePctBandIndex,
  getThreePuttBandIndex,
} from "./presets";

const HANDICAPS: HandicapIndex[] = [0, 5, 10, 15, 20, 25];

function toHandicapIndex(preset: HandicapPreset): HandicapIndex {
  if (HANDICAPS.includes(preset as HandicapIndex)) return preset as HandicapIndex;
  return 10;
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
 * Option A (direct): P(1) = make%, P(3+) = threePutt%, P(2) = remainder.
 * Split 3+ into 3 vs 4: 80% of 3+ → 3-putt, 20% → 4-putt.
 */
export function rollPutts(
  distanceFeet: number,
  handicapPreset: HandicapPreset
): 1 | 2 | 3 | 4 {
  const p1 = getMakePctForDistance(distanceFeet, handicapPreset);
  const p3plus = getThreePuttPctForDistance(distanceFeet, handicapPreset);
  const p2 = Math.max(0, 1 - p1 - p3plus);
  const p3 = p3plus * 0.8;
  const p4 = p3plus * 0.2;
  const r = Math.random();
  if (r < p1) return 1;
  if (r < p1 + p2) return 2;
  if (r < p1 + p2 + p3) return 3;
  return 4;
}
