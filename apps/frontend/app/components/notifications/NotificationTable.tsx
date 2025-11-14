"use client";

import { BellAlertIcon } from "@heroicons/react/24/solid";
import { Variants } from "motion";
import { AnimatePresence, motion, MotionProps } from "motion/react";

import { useState } from "react";

const notificationTableVariants: Variants = {
	hidden: {
		opacity: 1,
		translateX: 300,
		transition: { type: "spring", stiffness: 300, damping: 40 },
	},
	visible: {
		opacity: 1,
		translateX: 0,
		transition: { type: "spring", stiffness: 300, damping: 40 },
	},
};

export default function NotificationTable({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(true);
	const buttonMotionProps: MotionProps = {
		initial: { translateX: 0 },
		animate: { translateX: isOpen ? -300 : 0 },
		transition: { type: "spring", stiffness: 300, damping: 40 },
		whileTap: { scale: 0.95 },
	};
	return (
		<div>
			<motion.div
				className="fixed -right-6 top-[49%] size-15 rounded-full z-40 bg-lightSecondary dark:bg-darkSecondary transition-colors duration-500"
				{...buttonMotionProps}>
				<p>.</p>
			</motion.div>
			<div className="fixed right-0 top-0 flex flex-row items-center z-50">
				<div className="relative">
					<motion.button
						onClick={() => setIsOpen(!isOpen)}
						{...buttonMotionProps}
						className="flex flex-row justify-around hover:cursor-pointer fixed -right-1 top-1/2  text-lightText  transition-colors duration-500 items-center font-semibold  gap-2 p-2 rounded-md mb-4 ">
						<motion.div className=" ">
							<BellAlertIcon className="size-6 shrink-0" />
						</motion.div>
					</motion.button>

					<AnimatePresence>
						{isOpen && (
							<motion.div
								variants={notificationTableVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
								className="h-[94.5dvh] flex flex-col border-l-2 overflow-y-scroll border-l-lightSecondary dark:border-l-darkSecondary   bg-lightPrimary dark:bg-darkPrimary transition-colors duration-500 mt-13 mb-4 px-2 w-75">
								<div className="mt-4 ">{children}</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
