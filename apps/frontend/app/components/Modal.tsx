"use client";

import { motion, AnimatePresence, spring } from "motion/react";
import { ReactNode } from "react";

const backdropVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

const modalVariants = {
	hidden: { y: -30, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: spring,
			damping: 20,
			stiffness: 300,
		},
	},
};

/**
 * A re-usable modal container
 * @param isOpen initial boolean value of whether the modal should be displayed or not
 * @param onClose Callback function
 * @param children Children of this container
 * @example <Modal isOpen={true}
 * onClose={() => {setIsOpen(false) router.back()} >
 * {children}
 * </ Modal>
 * @returns
 */
export default function Modal({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					variants={backdropVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					onClick={onClose}>
					<motion.div
						className="bg-lightPrimary p-6 rounded-xl flex flex-col justify-center overflow-hidden relative shadow-xl w-full max-w-md mx-4 dark:bg-darkPrimary"
						variants={modalVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true">
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
