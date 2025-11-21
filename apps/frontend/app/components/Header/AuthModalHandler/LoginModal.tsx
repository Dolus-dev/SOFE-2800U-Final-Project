"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Email } from "@repo/types";
import Modal from "../../Modal";
import handleLogin from "@/app/lib/auth/handleLogin";
import { isValidEmail } from "@/app/lib/authValidations";

export default function LoginModal() {
	const [submissionDisabled, setSubmissionDisabled] = useState(true);
	const [emailValid, setEmailValid] = useState<null | true | false>(null);
	const [login, setLogin] = useState<{
		username: string;
		email: Email | string;
		pass: string;
	}>({
		username: "",
		email: "",
		pass: "",
	});
	const [isOpen, setIsOpen] = useState(false);

	const handleFormChange = (event: EventTarget & HTMLInputElement) => {
		const input = event.value.trim();

		switch (event.id) {
			case "username/email":
				const isEmail = input.includes("@");

				setLogin((prev) => ({
					...prev,
					username: "",
					email: input,
				}));
				if (isEmail && isValidEmail(input)) {
					setEmailValid(true);
				} else if (isEmail && !isValidEmail(input)) setEmailValid(false);
				else setEmailValid(null);

				break;
			case "password":
				setLogin((prev) => ({
					...prev,
					pass: input.trim(),
				}));
				break;
		}

		if (login.pass !== "" && (login.username !== "" || login.username !== "")) {
			setSubmissionDisabled(false);
		} else setSubmissionDisabled(true);
	};

	return (
		<>
			<motion.button
				onClick={() => setIsOpen(true)}
				className="py-3 hover:cursor-pointer transition-colors duration-500 font-semibold hover:text-lightTextMuted active:text-lightTextMuted"
				whileTap={{ scale: 0.9 }}>
				Login
			</motion.button>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}>
				<header className="bg-lightSecondary py-2 dark:bg-darkSecondary w-full">
					<h2 className="text-lightText font-semibold ml-4">
						Log into your account
					</h2>
				</header>
				<main className="mt-4 text-lightText dark:text-darkText">
					<form
						onSubmit={async (e) => {
							e.preventDefault();

							const formData = new FormData();
							formData.append("username", login.username);
							formData.append("email", login.email);
							formData.append("password", login.pass);

							await handleLogin(formData);
						}}
						className="flex flex-col gap-4 px-4 py-2 place-self-center">
						<div>
							<label htmlFor="username/email">Username/Email:</label>
							<input
								type="text"
								value={login.username ? login.username : login.email}
								id="username/email"
								name="username/email"
								onChange={(e) => handleFormChange(e.target)}
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
							{emailValid === false && (
								<p className="text-red-500 text-sm font-semibold -mb-2">
									Invalid Email
								</p>
							)}
						</div>

						<div>
							<label htmlFor="password">Password:</label>
							<input
								type="password"
								id="password"
								name="password"
								onChange={(e) => handleFormChange(e.target)}
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
						</div>

						<button
							type="submit"
							disabled={submissionDisabled}
							className="bg-accent w-50 place-self-center rounded-lg p-1 text-black disabled:cursor-not-allowed disabled:bg-gray-400/90 disabled:text-black/40 hover:cursor-pointer">
							Login
						</button>
					</form>
				</main>
			</Modal>
		</>
	);
}
