"use client";

import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { motion } from "motion/react";

export default function BouncingArrow() {
	return (
		<motion.div
			animate={{
				translateY: [-5, 5, -5],
				transition: { duration: 1.5, repeat: Infinity },
			}}
			className="flex flex-row text-lightText dark:text-darkText transition-colors duration-500 items-center font-semibold text-xl gap-2 p-2 ">
			<ArrowDownIcon className="size-6 shrink-0" />
		</motion.div>
	);
}
