import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { Theme } from "./lib/types/enums";
import isValidTheme from "./lib/validateTheme";
import { UserProvider } from "./components/UserProvider";
import ThemeToggler from "./components/Header/ThemeToggler";
import AuthModalHandler from "./components/Header/AuthModalHandler/AuthModalHandler";
import SessionDropdown from "./components/Header/SessionDropdown";

/** Fonts to be chosen later */

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Tick-It - Task Management",
	description: "Keep trasck of your work from anywhere!",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	let theme: Theme = Theme.Light;

	if (cookieStore.has("theme")) {
		const storedTheme = cookieStore.get("theme")?.value;
		if (!isValidTheme(storedTheme)) theme = Theme.Light;
		else theme = storedTheme;
	}

	return (
		<html
			lang="en"
			className="scroll-smooth"
			data-scroll-behavior="smooth"
			data-theme={`${theme === Theme.Light ? "" : "dark"}`}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased relative max-w-dvw flex flex-col min-h-dvh`}>
				<UserProvider>
					{/* Header - appears on all pages */}
					<header className="text-lightText sticky top-0 z-10 bg-lightSecondary flex flex-row justify-end gap-6 dark:bg-darkSecondary border-b-accent border-b-2 transition-colors duration-500">
						<div className="absolute -top-1 left-4">
							<ThemeToggler />
						</div>
						<AuthModalHandler />
						<SessionDropdown />
					</header>

					{/* Main content - changes per page */}
					<main className="mb-auto min-h-full flex flex-col bg-lightPrimary dark:bg-darkPrimary transition-colors duration-500">
						{children}
					</main>

					{/* Footer - appears on all pages */}
					<footer className="bg-lightSecondary text-lightText sticky bottom-0 z-10 dark:bg-darkSecondary flex flex-col transition-colors duration-500">
						<div className="place-self-center">
							<p>Tick-It &copy; 2025</p>
						</div>
					</footer>
				</UserProvider>
			</body>
		</html>
	);
}
