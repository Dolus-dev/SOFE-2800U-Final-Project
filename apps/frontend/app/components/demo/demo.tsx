"use client";

import { AnimatePresence, motion, useInView, Variants } from "motion/react";
import { useEffect, useRef } from "react";

const demoVariants: Variants = {
	offscreen: {
		opacity: 0,
	},
	onscreen: {
		opacity: 1,
		transition: {
			type: "spring",
			bounce: 0.2,
			duration: 1,
		},
	},
};

export default function Demo() {
	const ref = useRef(null);
	const isInView = useInView(ref);

	useEffect(() => {
		console.log("Element is in view: ", isInView);
	}, [isInView]);
	return (
		<AnimatePresence>
			<motion.div
				ref={ref}
				initial="offscreen"
				whileInView="onscreen"
				variants={demoVariants}>
				<div className="size-50 bg-red-500">Hello World</div>
			</motion.div>
		</AnimatePresence>
	);
}
