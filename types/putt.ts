export type HandicapPreset = 0 | 5 | 10 | 15 | 20 | 25;

export interface DistanceMakePct {
  distanceFeet: number;
  makePct: number;
}

export interface CustomPercentages {
  bands: { minFt: number; maxFt: number; makePct: number }[];
}

export interface PuttResult {
  putts: 1 | 2 | 3 | 4;
  makePctUsed?: number;
}

export interface PuttHistoryEntry {
  id: string;
  distanceFeet: number;
  putts: number;
  handicapPreset: number | null;
  createdAt: string;
}
