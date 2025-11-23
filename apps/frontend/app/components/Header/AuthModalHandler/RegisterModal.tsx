"use client";

import { isValidEmail } from "@/app/lib/authValidations";
import { Email, Password } from "@repo/types";
import { motion } from "motion/react";

import { useState } from "react";
import Modal from "../../Modal";
import useSWRMutation from "swr/mutation";

type RegisterResponse = {
	success: boolean;
	message?: string;
	fieldErrors?: {
		[k: string]: string;
	};
};

class FetchError extends Error {
	fieldErrors?: { [k: string]: string };
	status?: number;

	constructor(
		message: string,
		fieldErrors?: { [k: string]: string },
		status?: number
	) {
		super(message);
		this.name = "FetchError";
		this.fieldErrors = fieldErrors;
		this.status = status;
	}
}

export default function RegisterModal() {
	function isValidPassword(s: string): {
		valid: boolean;
		reason?:
			| "Password must be at least 8 characters long"
			| "Password must contain at least 1 Uppercase, 1 Lowercase, and 1 Special Character";
	} {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

		if (s.length < 8)
			return {
				valid: false,
				reason: "Password must be at least 8 characters long",
			};
		else {
			return regex.test(s) == true
				? { valid: true }
				: {
						valid: false,
						reason:
							"Password must contain at least 1 Uppercase, 1 Lowercase, and 1 Special Character",
					};
		}
	}

	async function fetcher(
		url: string,
		{
			arg,
		}: {
			arg: {
				username: string;
				firstName: string;
				lastName: string;
				email: Email;
				password: Password;
			};
		}
	) {
		const res = await fetch(url, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(arg),
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new FetchError(
				errorData.message || `HTTP ${res.status}`,
				errorData.fieldErrors,
				res.status
			);
		}

		return await res.json();
	}

	const { trigger, isMutating } = useSWRMutation<
		RegisterResponse,
		Error,
		"http://localhost:3001/auth/register",
		{
			username: string;
			firstName: string;
			lastName: string;
			email: Email;
			password: Password;
		}
	>("http://localhost:3001/auth/register", fetcher);

	const [isOpen, setIsOpen] = useState(false);
	const [firstNameMissing, setFirstNameMissing] = useState(false);
	const [lastNameMissing, setLastNameMissing] = useState(false);
	const [usernameMissing, setUsernameMissing] = useState<{
		missing: boolean;
		reason?: "Username must be at least 5 characters long" | string;
	}>({ missing: false });
	const [emailValid, setEmailValid] = useState<{
		valid: boolean;
		reason?: "Invalid Email" | string;
	}>({ valid: true });
	const [passwordValid, setPasswordValid] = useState<{
		valid: boolean;
		reason?:
			| "Password must be at least 8 characters long"
			| "Password must contain at least 1 Uppercase, 1 Lowercase, and 1 Special Character"
			| undefined
			| string;
	}>({ valid: true });

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
							const formData = new FormData(e.currentTarget);
							const rawFormData = {
								username: String(formData.get("username")).trim(),
								firstName: String(formData.get("Fname")).trim(),
								lastName: String(formData.get("Lname")).trim(),
								email: String(formData.get("email")).trim(),
								password: String(formData.get("password")).trim(),
							};

							const passwordValidation = isValidPassword(rawFormData.password);
							const errors = {
								firstName: !rawFormData.firstName,
								lastName: !rawFormData.lastName,
								username:
									!rawFormData.username || rawFormData.username.length < 5,
								email: !isValidEmail(rawFormData.email),
								password: !passwordValidation.valid,
							};

							// Update all error states at once
							setFirstNameMissing(errors.firstName);
							setLastNameMissing(errors.lastName);
							setUsernameMissing({
								missing: errors.username,
								reason: "Username must be at least 5 characters long",
							});
							setEmailValid({
								valid: !errors.email,
								reason: errors.email ? "Invalid Email" : undefined,
							});
							setPasswordValid({
								valid: !errors.password,
								reason: passwordValidation.reason,
							});

							if (Object.values(errors).some((err) => err)) {
								console.log(Object.values(errors).some((err) => err));
								return;
							}

							const parsedFormData = {
								username: rawFormData.username,
								firstName: rawFormData.firstName,
								lastName: rawFormData.lastName,
								email: rawFormData.email as Email,
								password: rawFormData.password as Password,
							};

							try {
								const result = await trigger({ ...parsedFormData });

								console.log(result);
							} catch (error) {
								console.error("Registration error:", error);

								if (error instanceof FetchError && error.fieldErrors) {
									if (error.fieldErrors.username) {
										setUsernameMissing({
											missing: true,
											reason: error.fieldErrors.username,
										});
									}
									if (error.fieldErrors.email) {
										setEmailValid({
											valid: false,
											reason: error.fieldErrors.email,
										});
									}
								}
							}
						}}
						className="flex flex-col gap-4 px-4 py-2 place-items-center ">
						<div className=" flex flex-row gap-4 justify-items-center">
							<div className="flex flex-col">
								<label htmlFor="">First Name:</label>
								<input
									type="text"
									name="Fname"
									// required
									className="w-35 border-2 block rounded-md border-black bg-gray-400/20 px-2"
								/>
								{firstNameMissing == true && (
									<p className="text-red-500 text-em font-semibold -mb-2">
										First name is required.
									</p>
								)}
							</div>
							<div className="flex flex-col">
								<label htmlFor="Fname">Last Name:</label>
								<input
									type="text"
									name="Lname"
									// required
									className="w-35 border-2 block rounded-md border-black bg-gray-400/20 px-2"
								/>
								{lastNameMissing == true && (
									<p className="text-red-500 text-sm font-semibold -mb2">
										Last name is required.
									</p>
								)}
							</div>
						</div>
						<div>
							<label htmlFor="username">Username:</label>
							<input
								type="text"
								name="username"
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
								// required
							/>
							{usernameMissing.missing === true && (
								<p className="text-red-500 text-sm font-semibold -mb2">
									{usernameMissing.reason}
								</p>
							)}
						</div>
						<div>
							<label htmlFor="email">Email:</label>
							<input
								type="email"
								name="email"
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
								// required
							/>
							{emailValid.valid === false && (
								<p className="text-red-500 text-sm font-semibold -mb-2">
									{emailValid.reason}
								</p>
							)}
						</div>
						<div className="flex flex-col items-start w-70">
							<label htmlFor="password">Password:</label>
							<input
								type="password"
								name="password"
								// required
								className="w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
							{passwordValid.valid === false && (
								<p className="text-red-500 text-xs text-start font-semibold -mb-2 ">
									{passwordValid.reason}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isMutating}
							className="bg-accent w-50 place-self-center rounded-lg p-1 text-black disabled:cursor-not-allowed disabled:bg-gray-400/90 disabled:text-black/40 hover:cursor-pointer">
							Register
						</button>
					</form>
				</main>
			</Modal>
		</>
	);
}
