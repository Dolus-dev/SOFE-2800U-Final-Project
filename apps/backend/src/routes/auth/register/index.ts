import express from "express";
import "dotenv/config";
import { User } from "../../../lib/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setSessionToken } from "../../../lib/setSessionToken";
export const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { username, email, password, firstName, lastName } = req.body;

		const fieldErrors: { [k: string]: string } = {};

		const existingUserByUsername = await User.findOne({ username });
		if (existingUserByUsername) fieldErrors.username = "Username already taken";

		const existingUserByEmail = await User.findOne({ email });
		if (existingUserByEmail) fieldErrors.email = "Email already registered";

		if (Object.keys(fieldErrors).length > 0) {
			return res.status(400).json({
				message: "There were errors with your submission",
				fieldErrors,
			});
		}

		const passwordHash = await bcrypt.hash(password, 12);

		const newUser = new User({
			username,
			email,
			passwordHash,
			firstName: firstName,
			lastName: lastName,
		});
		await newUser.save();

		setSessionToken(res, {
			userUUID: newUser.UUID,
			username: newUser.username,
		});

		return res.status(201).json({
			success: true,
			message: "Account successfully created",
			user: {
				UUID: newUser.UUID,
				username: newUser.username,
				email: newUser.email,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
			},
		});
	} catch (error) {
		console.error("Error during registration:", error);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
});
