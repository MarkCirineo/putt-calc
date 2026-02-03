import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
	title: "Putt Calculator",
	description: "Golf simulator putting calculator",
	manifest: "/manifest.json"
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased min-h-screen bg-neutral-50 text-neutral-900">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
