"use client";

import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";
import { useState } from "react";
export default function Page() {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(true);
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
				setTimeout(() => {
					router.back();
				}, 500);
			}}>
			<header className="absolute top-0 left-0 bg-lightSecondary py-2 dark:bg-darkSecondary w-full ">
				<h2 className="text-lightText dark:text-darkText font-semibold ml-4">
					Sign into or create your account
				</h2>
			</header>
			<main className="mt-4 text-lightText dark:text-darkText">
				<div>This is a test modal</div>
			</main>
		</Modal>
	);
}
