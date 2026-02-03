"use client";

import { useEffect, useState } from "react";
import type { PuttHistoryEntry } from "@/types/putt";

interface HistoryProps {
	authenticated: boolean;
	refreshTrigger?: number;
}

export function History({ authenticated, refreshTrigger = 0 }: HistoryProps) {
	const [entries, setEntries] = useState<PuttHistoryEntry[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!authenticated) {
			setEntries([]);
			return;
		}
		let cancelled = false;
		setLoading(true);
		fetch("/api/history?limit=50")
			.then((r) => r.json())
			.then((data) => {
				if (!cancelled && Array.isArray(data)) setEntries(data);
			})
			.catch(() => {})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [authenticated, refreshTrigger]);

	if (!authenticated) return null;

	return (
		<section className="space-y-2">
			<h2 className="text-lg font-semibold">History</h2>
			{loading ? (
				<p className="text-sm text-neutral-500">Loading…</p>
			) : entries.length === 0 ? (
				<p className="text-sm text-neutral-500">
					No putts yet. Calculate some to see history.
				</p>
			) : (
				<ul className="space-y-1 rounded-lg border border-neutral-200 divide-y divide-neutral-200 overflow-hidden bg-white">
					{entries.map((e) => (
						<li
							key={e.id}
							className="flex justify-between items-center px-3 py-2 text-sm"
						>
							<span>
								{e.distanceFeet} ft →{" "}
								<strong>
									{e.putts} putt{e.putts === 1 ? "" : "s"}
								</strong>
							</span>
							<span className="text-neutral-500 text-xs">
								{new Date(e.createdAt).toLocaleString()}
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
