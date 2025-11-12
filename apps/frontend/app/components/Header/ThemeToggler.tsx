"use server";

import { Theme } from "@/app/lib/types/enums";

import ThemeIcon from "./ThemeTogglerIcon";
import { cookies } from "next/headers";

/**
 * Button that toggles between Light and Dark modes
 * @param currentTheme The current theme that is stored in the Theme cookie. Default is Light mode
 * @returns
 */
export default async function ThemeToggler({}) {
	const cookieStore = await cookies();

	let activeTheme: Theme;

	if (cookieStore.has("theme")) {
		activeTheme = cookieStore.get("theme")?.value as Theme;
	} else activeTheme = Theme.Light;

	return (
		<>
			<ThemeIcon currentTheme={activeTheme} />
		</>
	);
}
