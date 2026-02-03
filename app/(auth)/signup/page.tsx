"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email.trim(),
					password,
					name: name.trim() || undefined
				})
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(data?.error ?? "Sign up failed");
				setLoading(false);
				return;
			}
			router.push("/signin?callbackUrl=/");
			router.refresh();
		} catch {
			setError("Something went wrong");
			setLoading(false);
		}
	}

	return (
		<main className="min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
			<div className="w-full max-w-sm">
				<h1 className="text-2xl font-bold mb-4">Sign up</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base"
							autoComplete="email"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium mb-1">
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base"
							autoComplete="new-password"
						/>
						<p className="mt-1 text-xs text-neutral-500">At least 8 characters</p>
					</div>
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-1">
							Name <span className="text-neutral-400">(optional)</span>
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base"
							autoComplete="name"
						/>
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-neutral-900 text-white py-2 px-4 font-medium disabled:opacity-50"
					>
						{loading ? "Creating account…" : "Sign up"}
					</button>
				</form>
				<p className="mt-4 text-sm text-neutral-600">
					Already have an account?{" "}
					<Link href="/signin" className="underline font-medium">
						Sign in
					</Link>
				</p>
				<Link
					href="/"
					className="mt-2 inline-block text-sm text-neutral-500 hover:underline"
				>
					← Back
				</Link>
			</div>
		</main>
	);
}
