"use client";

import { AnimatePresence, motion, spring, Variants } from "motion/react";

const notificationCardVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { type: spring, damping: 20, stiffness: 300 },
	},
};

export default function NotificationCard({
	children,
	taskName,
}: {
	children: React.ReactNode;
	taskName: string;
}) {
	return (
		<AnimatePresence>
			<motion.div
				variants={notificationCardVariants}
				initial="hidden"
				animate="visible"
				exit="hidden"
				className="bg-lightPrimary relative overflow-hidden flex flex-col justify-around dark:bg-darkPrimary rounded-xl p-4 mb-4 shadow-md shadow-lightText dark:shadow-lightPrimary border-2 border-accent transition-normal	 duration-500">
				<div className=" absolute flex flex-row top-4 left-0 -mt-4 w-full bg-lightSecondary dark:bg-darkSecondary transition-colors duration-500 justify-between items-center mb-2 px-2 py-1 rounded-md">
					<h3 className="font-bold text-[15px] truncate text-lightText ">
						{taskName}
					</h3>
				</div>
				<div className="text-lightText mt-5 dark:text-darkText transition-colors duration-500">
					{children}
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
