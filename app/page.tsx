"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PresetSelector } from "@/components/PresetSelector";
import { DistanceInput } from "@/components/DistanceInput";
import { ResultDisplay } from "@/components/ResultDisplay";
import { History } from "@/components/History";
import { PercentageEditor } from "@/components/PercentageEditor";
import type { HandicapPreset } from "@/types/putt";

export default function Home() {
	const { data: session, status } = useSession();
	const [preset, setPreset] = useState<HandicapPreset>(10);
	const [customMode, setCustomMode] = useState(false);
	const [result, setResult] = useState<{ putts: 1 | 2 | 3 | 4; } | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [historyRefresh, setHistoryRefresh] = useState(0);

	useEffect(() => {
		if (!session?.user) return;
		let cancelled = false;
		fetch("/api/settings")
			.then((r) => r.json())
			.then((data) => {
				if (!cancelled && data?.handicapPreset != null) {
					const n = Number(data.handicapPreset);
					if ([0, 5, 10, 15, 20, 25].includes(n)) setPreset(n as HandicapPreset);
				}
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [session?.user]);

	const savePreset = useCallback(
		async (p: HandicapPreset) => {
			if (!session?.user) return;
			try {
				await fetch("/api/settings", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ handicapPreset: p })
				});
			} catch (e) {
				console.error("Failed to save preset", e);
			}
		},
		[session?.user]
	);

	const handlePresetChange = useCallback(
		(p: HandicapPreset) => {
			setPreset(p);
			savePreset(p);
		},
		[savePreset]
	);

	const handleCalculate = useCallback(
		async (distanceFeet: number) => {
			setLoading(true);
			setResult(null);
			try {
				const res = await fetch("/api/putt", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						distanceFeet,
						preset: customMode ? undefined : preset
					})
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data?.error ?? "Request failed");
				setResult({ putts: data.putts });
				if (session?.user) setHistoryRefresh((n) => n + 1);
			} catch (e) {
				console.error(e);
				setResult(null);
			} finally {
				setLoading(false);
			}
		},
		[preset, customMode, session?.user]
	);

	return (
		<main className="min-h-screen p-4 md:p-6 max-w-2xl mx-auto">
			<header className="flex flex-wrap items-center justify-between gap-2 mb-6">
				<h1 className="text-xl font-bold">Putt Calculator</h1>
				<nav className="flex items-center gap-3">
					{status === "loading" ? (
						<span className="text-sm text-neutral-500">Loading…</span>
					) : session?.user ? (
						<>
							<span className="text-sm text-neutral-600">{session.user.email}</span>
							<button
								type="button"
								onClick={() => signOut({ callbackUrl: "/" })}
								className="text-sm underline text-neutral-600 hover:text-neutral-900"
							>
								Sign out
							</button>
						</>
					) : (
						<>
							<Link
								href="/signin"
								className="text-sm underline text-neutral-600 hover:text-neutral-900"
							>
								Sign in
							</Link>
							<Link
								href="/signup"
								className="text-sm underline text-neutral-600 hover:text-neutral-900"
							>
								Sign up
							</Link>
						</>
					)}
				</nav>
			</header>

			<div className="space-y-6">
				{!customMode && (
					<PresetSelector
						value={preset}
						onChange={handlePresetChange}
						disabled={loading}
					/>
				)}
				<PercentageEditor
					active={customMode}
					onToggle={!customMode ? undefined : () => setCustomMode(false)}
				/>
				{!customMode && (
					<button
						type="button"
						onClick={() => setCustomMode(true)}
						className="text-sm underline text-neutral-600 hover:text-neutral-900"
					>
						Use custom percentages (coming soon)
					</button>
				)}

				<section className="space-y-2">
					<h2 className="text-lg font-semibold">Calculator</h2>
					<DistanceInput onSubmit={handleCalculate} disabled={loading} />
					<ResultDisplay
						putts={result?.putts ?? null}
					/>
				</section>

				<History authenticated={!!session?.user} refreshTrigger={historyRefresh} />
			</div>
		</main>
	);
}
