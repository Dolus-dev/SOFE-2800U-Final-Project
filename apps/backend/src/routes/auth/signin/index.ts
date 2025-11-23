import express from "express";
import "dotenv/config";
import { User } from "../../../lib/models";
import bcrypt from "bcrypt";

import { setSessionToken } from "../../../lib/setSessionToken";

export const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { credential, password } = req.body;

		const fieldErrors: { [k: string]: string } = {};

		// Validate inputs
		if (!credential) {
			fieldErrors.credential = "Username or email is required";
		}
		if (!password) {
			fieldErrors.password = "Password is required";
		}

		if (Object.keys(fieldErrors).length > 0) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				fieldErrors,
			});
		}

		// Determine if credential is email or username
		const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential);

		// Single database query based on credential type
		const user = await User.findOne(
			isEmail ? { email: credential } : { username: credential }
		);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
				fieldErrors: {
					credential: "Invalid username or email",
				},
			});
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
				fieldErrors: {
					password: "Incorrect password",
				},
			});
		}

		setSessionToken(res, {
			userUUID: user.UUID,
			username: user.username,
		});

		// Success - return user info (no password)
		return res.status(200).json({
			success: true,
			message: "Login successful",
			user: {
				id: user._id,
				UUID: user.UUID,
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({
			success: false,
			message: "Server error during login",
		});
	}
});
