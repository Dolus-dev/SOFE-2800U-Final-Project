"use client";

import { useState } from "react";
import Modal from "../../Modal";

export default function AuthModalHandler() {
	const [modalType, setModalType] = useState<"login" | "signup" | null>(null);

	return (
		<>
			<button
				onClick={() => setModalType("login")}
				className="py-3">
				Login
			</button>
			<button
				onClick={() => setModalType("signup")}
				className="py-3 hover:cursor-pointer">
				Signup
			</button>

			<Modal
				isOpen={modalType == "login"}
				onClose={() => {
					setModalType(null);
				}}>
				<header className="absolute top-0 left-0 bg-lightSecondary py-2 dark:bg-darkSecondary w-full ">
					<h2 className="text-lightText  font-semibold ml-4">
						Log into your account
					</h2>
				</header>
				<main className="mt-4 text-lightText dark:text-darkText">
					<div>This is a test modal</div>
					<button
						onClick={() =>
							setModalType("signup")
						}>{`Don't have an account?`}</button>
				</main>
			</Modal>

			<Modal
				isOpen={modalType === "signup"}
				onClose={() => {
					setTimeout(() => setModalType(null), 500);
				}}>
				<header className="absolute top-0 left-0 bg-lightSecondary py-2 dark:bg-darkSecondary w-full ">
					<h2 className="text-lightText  font-semibold ml-4">
						create your account
					</h2>
				</header>
				<main className="mt-4 text-lightText dark:text-darkText">
					<div>This is a test modal</div>
					<button
						onClick={() => {
							setModalType("login");
						}}>{`Already have an account?`}</button>
				</main>
			</Modal>
		</>
	);
}
