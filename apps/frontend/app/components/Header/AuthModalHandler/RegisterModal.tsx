"use client";

import { isValidEmail } from "@/app/lib/authValidations";
import { AccountRegistrationData, Email, Password } from "@repo/types";
import { motion } from "motion/react";

import { useState } from "react";
import Modal from "../../Modal";
import handleRegister from "@/app/lib/auth/handleRegister";

export default function RegisterModal() {
	function isValidPassword(s: string) {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

		if (!regex.test(s)) {
			return false;
		} else return true;
	}

	const [userDetails, setUserDetails] = useState<AccountRegistrationData>({
		username: "",
		email: "",
		password: null,
		Fname: "",
		Lname: "",
	});

	const [email, setEmail] = useState<{
		valid: boolean | null;
		errorMessage?: string;
	}>({ valid: null });
	const [password, setPassword] = useState<{
		valid: boolean | null;
		errorMessage?: string;
	}>({ valid: null });
	const [isOpen, setIsOpen] = useState(false);
	const [submissionDisabled, setSubmissionDisabled] = useState(true);

	const handleFormChange = (event: EventTarget & HTMLInputElement) => {
		const input = event.value.trim();

		switch (event.id) {
			case "username":
				setUserDetails((prev) => ({
					...prev,
					username: input,
				}));
				break;
			case "email":
				try {
					if (!isValidEmail(input)) {
						setEmail({ valid: false, errorMessage: "Invalid Email Format" });
					} else setEmail({ valid: true });
					setUserDetails((prev) => ({ ...prev, email: input }));
				} catch (e) {
					console.log(e);
				} finally {
					break;
				}
			case "Fname":
				setUserDetails((prev) => ({
					...prev,
					Fname: input,
				}));
				break;
			case "Lname":
				setUserDetails((prev) => ({
					...prev,
					Lname: input,
				}));
				break;
			case "password":
				try {
					if (!isValidPassword(input)) {
						setPassword({
							valid: false,
							errorMessage: `Password have 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 8 characters long`,
						});
					} else if (isValidPassword(input)) {
						setPassword({
							valid: true,
						});
					}

					setUserDetails((prev) => ({
						...prev,
						password: input as Password,
					}));
				} catch (error) {
					console.log(error);
				}
		}

		if (
			userDetails.Fname === "" ||
			userDetails.Lname === "" ||
			email.valid === false ||
			password.valid === false ||
			userDetails.username === ""
		) {
			setSubmissionDisabled(true);
		} else setSubmissionDisabled(false);
	};

	return (
		<>
			<motion.button
				onClick={() => setIsOpen(true)}
				className="py-3 hover:cursor-pointer transition-colors duration-500 font-semibold hover:text-lightTextMuted active:text-lightTextMuted"
				whileTap={{ scale: 0.9 }}>
				Register
			</motion.button>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}>
				<header className="bg-lightSecondary py-2 dark:bg-darkSecondary w-full">
					<h2 className="text-textLight font-semibold ml-4 ">
						Create your account
					</h2>
				</header>
				<main className="mt-4 text-lightText dark:text-darkText">
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							const formData = new FormData();
							formData.append("username", userDetails.username);
							formData.append("Fname", userDetails.Fname);
							formData.append("Lname", userDetails.Lname);
							formData.append("email", userDetails.email as Email);
							formData.append("password", userDetails.password as Password);
							await handleRegister(formData);
						}}
						className="flex flex-col gap-4 px-4 py-2 place-self-center">
						<div className=" flex flex-row gap-4 justify-items-center">
							<div className="flex flex-col">
								<label htmlFor="Fname">First Name:</label>
								<input
									type="text"
									id="Fname"
									onChange={(e) => handleFormChange(e.target)}
									className="w-35 border-2 block rounded-md border-black bg-gray-400/20 px-2"
								/>
							</div>
							<div className="flex flex-col">
								<label htmlFor="Fname">Last Name:</label>
								<input
									type="text"
									id="Lname"
									onChange={(e) => handleFormChange(e.target)}
									className="w-35 border-2 block rounded-md border-black bg-gray-400/20 px-2"
								/>
							</div>
						</div>
						<div>
							<label htmlFor="username">Username:</label>
							<input
								type="text"
								id="username"
								onChange={(e) => handleFormChange(e.target)}
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
						</div>
						<div>
							<label htmlFor="email">Email:</label>
							<input
								type="text"
								id="email"
								onChange={(e) => handleFormChange(e.target)}
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
							{email.valid === false && (
								<p className="text-red-500 text-sm font-semibold -mb-2">
									{email.errorMessage}
								</p>
							)}
						</div>
						<div>
							<label htmlFor="password">Password:</label>
							<input
								type="password"
								id="password"
								onChange={(e) => handleFormChange(e.target)}
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
							{password.valid === false && (
								<p className="text-red-500 text-sm font-semibold -mb-2 ">
									{password.errorMessage}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={submissionDisabled}
							className="bg-accent w-50 place-self-center rounded-lg p-1 text-black disabled:cursor-not-allowed disabled:bg-gray-400/90 disabled:text-black/40 hover:cursor-pointer">
							Register
						</button>
					</form>
				</main>
			</Modal>
		</>
	);
}
