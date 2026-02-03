"use client";

interface ResultDisplayProps {
	putts: 1 | 2 | 3 | 4 | null;
	makePctUsed?: number;
}

export function ResultDisplay({ putts, makePctUsed }: ResultDisplayProps) {
	if (putts == null) return null;
	const label = putts === 1 ? "1 putt" : `${putts} putts`;
	return (
		<div className="rounded-xl bg-neutral-100 border border-neutral-200 p-4 sm:p-6">
			<p className="text-2xl sm:text-3xl font-bold">{label}</p>
			{makePctUsed != null && (
				<p className="mt-1 text-sm text-neutral-600">
					Make % used: {Math.round(makePctUsed * 100)}%
				</p>
			)}
		</div>
	);
}
