"use server";

import { cookies } from "next/headers";
import { Theme } from "./types/enums";

export default async function toggleTheme() {
	const cookieStore = await cookies();

	const themeCookieExists = cookieStore.has("theme");

	if (themeCookieExists) {
		const currentTheme = cookieStore.get("theme")?.value as Theme;

		if (currentTheme === Theme.Light) {
			cookieStore.set("theme", Theme.Dark);
		} else cookieStore.set("theme", Theme.Light);
	} else {
		cookieStore.set("theme", Theme.Dark);
	}
}
