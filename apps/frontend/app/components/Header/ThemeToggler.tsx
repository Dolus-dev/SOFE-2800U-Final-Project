"use client";

import { Theme } from "@/app/lib/types/enums";
import toggleTheme from "@/app/lib/updateTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, easeInOut, motion, spring } from "motion/react";
import { useState } from "react";

const motionProps = {
	initial: { opacity: 0, scale: 1 },
	animate: {
		opacity: 1,
		scale: 1,
		ease: [0.26, 0.02, 0.23, 0.94],
	},
	exit: {
		opacity: 0,
		scale: 0.6,
		ease: [0.26, 0.02, 0.23, 0.94],
	},
	transition: { duration: 0.5 },
};

export default function ThemeToggler({
	currentTheme,
}: {
	currentTheme: Theme;
}) {
	const [theme, setCurrentTheme] = useState(currentTheme);
	return (
		<>
			{theme === Theme.Light && (
				<motion.button
					className="hover: cursor-pointer"
					onClick={() => {
						setCurrentTheme(Theme.Dark);
						toggleTheme();
					}}
					whileTap={{ scale: 0.95 }}>
					<AnimatePresence mode="wait">
						<motion.div {...motionProps}>
							<SunIcon className="absolute size-6 text-white " />
						</motion.div>
					</AnimatePresence>
				</motion.button>
			)}

			{theme === Theme.Dark && (
				<motion.button
					className="hover: cursor-pointer"
					onClick={() => {
						setCurrentTheme(Theme.Light);
						toggleTheme();
					}}
					whileTap={{ scale: 0.95 }}>
					<AnimatePresence mode="wait">
						<motion.div {...motionProps}>
							<MoonIcon className="absolute size-6 text-white " />
						</motion.div>
					</AnimatePresence>
				</motion.button>
			)}
		</>

		// <button
		// 	onClick={() => toggleTheme()}
		// 	className="hover: cursor-pointer">
		// 	<SunIcon className=" absolute size-6 text-white  dark:opacity-0 transition-all duration-500" />
		// 	<MoonIcon className=" absolute size-6 text-white  opacity-0 dark:block dark:opacity-100 transition-all duration-500" />
		// </button>
	);
}
