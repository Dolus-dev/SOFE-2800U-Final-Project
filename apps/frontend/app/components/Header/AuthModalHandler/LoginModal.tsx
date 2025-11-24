"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Email, Password } from "@repo/types";
import Modal from "../../Modal";
import useSWRMutation from "swr/mutation";
import { isValidEmail } from "@/app/lib/authValidations";
import { useUser } from "../../UserProvider";

type LoginResponse = {
	success: boolean;
	message?: string;
	fieldErrors?: {
		[k: string]: string;
	};
	user?: {
		id: string;
		UUID: string;
		username: string;
		email?: string;
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

export default function LoginModal() {
	async function fetcher(
		url: string,
		{
			arg,
		}: {
			arg: {
				credential: string;
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
		LoginResponse,
		Error,
		"http://localhost:3001/auth/signin",
		{
			credential: string;
			password: Password;
		}
	>("http://localhost:3001/auth/signin", fetcher);

	const [emailValid, setEmailValid] = useState<null | true | false>(null);
	const [credentialError, setCredentialError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [loginState, setLoginState] = useState<{
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

				setLoginState((prev) => ({
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
				setLoginState((prev) => ({
					...prev,
					pass: input.trim(),
				}));
				break;
		}
	};

	const { login } = useUser();
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
							const formData = new FormData(e.currentTarget);

							const rawFormData = {
								credential: String(formData.get("username/email")).trim(),
								password: String(formData.get("password")).trim(),
							};

							// Clear previous errors
							setCredentialError(null);
							setPasswordError(null);

							// Client-side validation
							if (!rawFormData.credential) {
								setCredentialError("Username or email is required");
								return;
							}
							if (!rawFormData.password) {
								setPasswordError("Password is required");
								return;
							}

							const parsedFormData = {
								credential: rawFormData.credential,
								password: rawFormData.password as Password,
							};

							try {
								const result = await trigger({ ...parsedFormData });
								console.log("Login success:", result);

								if (result?.success) {
									// Close modal on success
									setIsOpen(false);
									const userDetail = {
										UUID: result.user?.UUID as string,
										username: result.user?.username as string,
										email: result.user?.email as Email,
									};
									login(userDetail);
									console.log("User logged in:", result.user);
									// Optional: redirect or show success message
								}
							} catch (error) {
								console.error("Login error:", error);

								if (error instanceof FetchError && error.fieldErrors) {
									if (error.fieldErrors.credential) {
										setCredentialError(error.fieldErrors.credential);
									}
									if (error.fieldErrors.password) {
										setPasswordError(error.fieldErrors.password);
									}
								}
							}
						}}
						className="flex flex-col gap-4 px-4 py-2 place-self-center">
						<div>
							<label htmlFor="username/email">Username/Email:</label>
							<input
								type="text"
								value={
									loginState.username ? loginState.username : loginState.email
								}
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
							{credentialError && (
								<p className="text-red-500 text-sm font-semibold -mb-2">
									{credentialError}
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
							{passwordError && (
								<p className="text-red-500 text-sm font-semibold -mb-2">
									{passwordError}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isMutating}
							className="bg-accent w-50 place-self-center rounded-lg p-1 text-black disabled:cursor-not-allowed disabled:bg-gray-400/90 disabled:text-black/40 hover:cursor-pointer">
							{isMutating ? "Logging in..." : "Login"}
						</button>
					</form>
				</main>
			</Modal>
		</>
	);
}
