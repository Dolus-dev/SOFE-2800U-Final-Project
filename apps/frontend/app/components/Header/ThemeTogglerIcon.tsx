"use client";

import { Theme } from "@/app/lib/types/enums";
import toggleTheme from "@/app/lib/updateTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function ThemeIcon({ currentTheme }: { currentTheme: Theme }) {
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

	const [theme, setCurrentTheme] = useState(currentTheme);
	console.log(theme);
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
	);
}
