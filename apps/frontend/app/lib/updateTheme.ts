"use server";

import { cookies } from "next/headers";
import { Theme } from "./types/enums";
import isValidTheme from "./validateTheme";

/**
 * Toggles the theme that is displayed to the user (Light/Dark)
 */
export default async function toggleTheme() {
	const cookieStore = await cookies();

	const themeCookieExists = cookieStore.has("theme");
	const currentTheme = cookieStore.get("theme")?.value;
	if (themeCookieExists) {
		if (isValidTheme(currentTheme)) {
			switch (currentTheme) {
				case Theme.Light:
					cookieStore.set("theme", Theme.Dark);
					break;
				case Theme.Dark:
					cookieStore.set("theme", Theme.Light);
					break;
			}
		} else cookieStore.set("theme", Theme.Light);
	} else cookieStore.set("theme", Theme.Light);
}
