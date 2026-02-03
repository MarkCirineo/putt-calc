"use client";

import type { HandicapPreset } from "@/types/putt";

const PRESETS: { value: HandicapPreset; label: string }[] = [
	{ value: 0, label: "0 HCP" },
	{ value: 5, label: "5 HCP" },
	{ value: 10, label: "10 HCP" },
	{ value: 15, label: "15 HCP" },
	{ value: 20, label: "20 HCP" },
	{ value: 25, label: "25 HCP" }
];

interface PresetSelectorProps {
	value: HandicapPreset | null;
	onChange: (v: HandicapPreset) => void;
	disabled?: boolean;
}

export function PresetSelector({ value, onChange, disabled }: PresetSelectorProps) {
	return (
		<div className="space-y-2">
			<span className="text-sm font-medium">Handicap preset</span>
			<div className="flex flex-wrap gap-2">
				{PRESETS.map((p) => (
					<button
						key={p.value}
						type="button"
						onClick={() => onChange(p.value)}
						disabled={disabled}
						className={`rounded-lg px-3 py-2 text-sm font-medium touch-manipulation ${
							value === p.value
								? "bg-neutral-900 text-white"
								: "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
						} disabled:opacity-50`}
					>
						{p.label}
					</button>
				))}
			</div>
		</div>
	);
}
