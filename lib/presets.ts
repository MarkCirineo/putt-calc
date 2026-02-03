/**
 * Handicap presets: make-% and 3-putt % by distance band × HCP.
 * Bands and values aligned with plan tables; refine from research as needed.
 */

export type HandicapIndex = 0 | 5 | 10 | 15 | 20 | 25;

/** Make-% bands (ft): 0–3, 3–6, …, 24–30, 30–40, 40–50, 50–60, 60+ (extrapolated beyond 30). */
export const MAKE_PCT_BANDS = [
	{ minFt: 0, maxFt: 3, label: "0–3 ft" },
	{ minFt: 3, maxFt: 6, label: "3–6 ft" },
	{ minFt: 6, maxFt: 9, label: "6–9 ft" },
	{ minFt: 9, maxFt: 12, label: "9–12 ft" },
	{ minFt: 12, maxFt: 18, label: "12–18 ft" },
	{ minFt: 18, maxFt: 24, label: "18–24 ft" },
	{ minFt: 24, maxFt: 30, label: "24–30 ft" },
	{ minFt: 30, maxFt: 40, label: "30–40 ft" },
	{ minFt: 40, maxFt: 50, label: "40–50 ft" },
	{ minFt: 50, maxFt: 60, label: "50–60 ft" },
	{ minFt: 60, maxFt: 999, label: "60+ ft" }
] as const;

/** Make-% by band index × HCP. Bands 0–7 from plan; 8–11 extrapolated (higher HCP drops faster). */
export const MAKE_PCT_TABLE: Record<HandicapIndex, number[]> = {
	0: [98, 76, 49, 34, 19, 12, 7, 4, 3, 2, 1.5, 1],
	5: [96, 67, 44, 34, 19, 13, 7, 3, 2.5, 2, 1.2, 0.8],
	10: [96, 65, 39, 26, 18, 10, 7, 3, 2.5, 1.5, 1, 0.5],
	15: [93, 59, 36, 22, 16, 9, 7, 2, 2, 1.2, 0.7, 0.4],
	20: [90, 55, 33, 18, 14, 7, 5, 2, 1.5, 1, 0.5, 0.3],
	25: [88, 48, 30, 17, 12, 6, 4, 2, 1.2, 0.7, 0.4, 0.2]
};

/** 3-putt % bands (ft): 10, 11–15, …, 36–40, 40–50, 50–60, 60+ (extrapolated beyond 40). */
export const THREE_PUTT_BANDS = [
	{ minFt: 0, maxFt: 10, label: "10 ft" },
	{ minFt: 11, maxFt: 15, label: "11–15 ft" },
	{ minFt: 16, maxFt: 20, label: "16–20 ft" },
	{ minFt: 21, maxFt: 25, label: "21–25 ft" },
	{ minFt: 26, maxFt: 30, label: "26–30 ft" },
	{ minFt: 31, maxFt: 35, label: "31–35 ft" },
	{ minFt: 36, maxFt: 40, label: "36–40 ft" },
	{ minFt: 41, maxFt: 50, label: "40–50 ft" },
	{ minFt: 51, maxFt: 60, label: "50–60 ft" },
	{ minFt: 61, maxFt: 999, label: "60+ ft" }
] as const;

/** 3-putt % by band index × HCP. Bands 0–7 from plan; 8–10 extrapolated (both distance and HCP raise 3-putt). */
export const THREE_PUTT_TABLE: Record<HandicapIndex, number[]> = {
	0: [1.7, 4, 8, 12, 16, 20, 25.3, 30, 35, 40, 45],
	5: [2.5, 5, 10, 14, 18, 22, 28, 35, 40, 46, 52],
	10: [3, 6, 12, 17, 22, 27, 33, 40, 45, 52, 58],
	15: [4, 8, 14, 19, 25, 30, 37, 44, 46, 48, 51],
	20: [8.4, 14, 20, 27, 33, 40, 48.3, 55, 58, 61, 64],
	25: [10, 18, 26, 34, 42, 50, 58, 65, 68, 71, 74]
};

export function getMakePctBandIndex(distanceFeet: number): number {
	for (let i = 0; i < MAKE_PCT_BANDS.length; i++) {
		const b = MAKE_PCT_BANDS[i];
		if (distanceFeet >= b.minFt && (b.maxFt > 999 || distanceFeet < b.maxFt)) return i;
	}
	return MAKE_PCT_BANDS.length - 1;
}

export function getThreePuttBandIndex(distanceFeet: number): number {
	for (let i = 0; i < THREE_PUTT_BANDS.length; i++) {
		const b = THREE_PUTT_BANDS[i];
		if (distanceFeet >= b.minFt && (b.maxFt > 999 || distanceFeet < b.maxFt)) return i;
	}
	return THREE_PUTT_BANDS.length - 1;
}
