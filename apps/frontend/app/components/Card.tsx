"use client";

import { Variants } from "motion";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";

const cardVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { type: "spring", damping: 20, stiffness: 300 },
	},
};

export default function Card({ children }: { children: ReactNode }) {
	return (
		<motion.div
			layout
			className="bg-lightPrimary overflow-hidden dark:bg-darkPrimary relative rounded-2xl shadow-md shadow-lightText dark:shadow-lightPrimary border-2 border-accent  min-h-4 h-auto transition-transform transition-normal duration-500">
			{children}
		</motion.div>
	);
}
