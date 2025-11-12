"use server";

import { Theme } from "@/app/lib/types/enums";

import ThemeIcon from "./ThemeTogglerIcon";
import { cookies } from "next/headers";
import isValidTheme from "@/app/lib/validateTheme";

/**
 * Button that toggles between Light and Dark modes
 * @param currentTheme The current theme that is stored in the Theme cookie. Default is Light mode
 * @returns
 */
export default async function ThemeToggler({}) {
	const cookieStore = await cookies();

	let activeTheme: Theme;

	if (cookieStore.has("theme")) {
		const themeCookieValue = cookieStore.get("theme")?.value;

		if (isValidTheme(themeCookieValue)) activeTheme = themeCookieValue;
		else activeTheme = Theme.Light;
	} else activeTheme = Theme.Light;

	return (
		<>
			<ThemeIcon currentTheme={activeTheme} />
		</>
	);
}
