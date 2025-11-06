"use client";

import toggleTheme from "@/app/lib/updateTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggler() {
	return (
		<button
			onClick={() => toggleTheme()}
			className="hover: cursor-pointer">
			<SunIcon className=" absolute size-6 text-white  dark:opacity-0 transition-all duration-500" />
			<MoonIcon className=" absolute size-6 text-white  opacity-0 dark:block dark:opacity-100 transition-all duration-500" />
		</button>
	);
}
