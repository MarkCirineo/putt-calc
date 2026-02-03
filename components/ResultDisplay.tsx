"use client";

interface ResultDisplayProps {
	putts: 1 | 2 | 3 | 4 | null;
}

export function ResultDisplay({ putts }: ResultDisplayProps) {
	if (putts == null) return null;
	const label = putts === 1 ? "1 putt" : `${putts} putts`;
	return (
		<div className="rounded-xl bg-neutral-100 border border-neutral-200 p-4 sm:p-6">
			<p className="text-2xl sm:text-3xl font-bold">{label}</p>
		</div>
	);
}
