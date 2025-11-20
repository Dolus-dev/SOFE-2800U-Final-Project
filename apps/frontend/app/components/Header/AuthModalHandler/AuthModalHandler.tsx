"use client";

import { useState } from "react";
import Modal from "../../Modal";
import { motion } from "motion/react";
import { Email } from "@/app/lib/types/types";
import { isValidEmail } from "@/app/lib/authValidations";
import handleLogin from "@/app/lib/auth/handleLogin";

export default function AuthModalHandler() {
	const [modalType, setModalType] = useState<"login" | "signup" | null>(null);
	const [login, setLogin] = useState<{ username: string; email: Email | string; pass: string }>({
		username: '',
		email: '',
		pass: "",
	});

	const [submissionDisabled, setSubmissionDisabled] = useState(true)

	const [emailValid, setEmailValid] = useState<null | true | false>(null);

	const handleCredentialChange = (input: string) => {
		const isEmail = input.includes("@");

		if (isEmail) {	
			setLogin((prev) => ({
				...prev,
				username: '',
				email: input
			}))
			setEmailValid(false)
			if (isValidEmail(input)) {
				setEmailValid(true)
			}
		}

		else {
			setLogin((prev)=>({
				...prev,
				username: input,
				email: ''
			}))
			setEmailValid(null)
		}

		console.log(login)
	};

	const handlePasswordChange = (input: string) => {
		setLogin((prev)=> ({
			...prev,
			pass: input,
		}))

		if (login.pass.trim() !== '' && (login.username.trim() !== '' || login.email.trim() !== '')) {
			setSubmissionDisabled(false)
		}
	}

		 

	return (
		<>
			<motion.button
				onClick={() => setModalType("login")}
				className="py-3 hover:cursor-pointer transition-colors duration-500 font-semibold hover:text-lightTextMuted active:text-lightTextMuted "
				whileTap={{ scale: 0.95 }}>
				Login
			</motion.button>
			<motion.button
				onClick={() => setModalType("signup")}
				className="py-3 hover:cursor-pointer font-semibold transition-colors duration-500 hover:text-lightTextMuted active:text-lightTextMuted "
				whileTap={{ scale: 0.95 }}>
				Signup
			</motion.button>

			{/**TODO: Replace content with login form*/}
			<Modal
				isOpen={modalType == "login"}
				onClose={() => {
					setModalType(null);
				}}>
				<header className=" bg-lightSecondary py-2 dark:bg-darkSecondary w-full ">
					<h2 className="text-lightText  font-semibold ml-4">
						Log into your account
					</h2>
				</header>
				<main className="mt-4 text-lightText dark:text-darkText">
					<form
						onSubmit={ async (e) => {
							e.preventDefault();

							const formData = new FormData();
							formData.append('username', login.username)
							formData.append('password', login.pass)

							await handleLogin(formData);

						}}
						
						className="flex flex-col 	gap-4 px-4 py-2 place-self-center">
						<div className="">
							<label htmlFor="username/email"> Username/Email:</label>
						
							<input
								type="text"
								value={login.username ? login.username : login.email}
								id="username/email"
								name="username/email"
								onChange={(e) => {handleCredentialChange(e.target.value)
									console.log(e.target.value)
								}}
								className=" w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
								{emailValid === false && (
								<p className="text-red-500 text-sm font-semibold - mb-2">Invalid Email</p>
							)}
						</div>
						<div className="">
							<label htmlFor="password">Password:</label>
							<input
								type="password"
								id="password"
								name="password"
								onChange={(e) => handlePasswordChange(e.target.value)}
								className=" w-70 border-2 block rounded-md border-black bg-gray-400/20 px-2"
							/>
						</div>

						<button
							type="submit"
							disabled={submissionDisabled}
							className="bg-accent w-50 place-self-center rounded-lg p-1 text-black hover:cursor-pointer">
							Login
						</button>
					</form>
				</main>
			</Modal>

			{/**TODO: replace content with signup form */}
			<Modal
				isOpen={modalType === "signup"}
				onClose={() => setModalType(null)}>
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
