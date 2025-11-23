import express from "express";
import { verifyToken } from "../../../lib/setSessionToken";
import { User } from "../../../lib/models";

export const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const token = req.cookies["session_token"];

		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Not Authenticated" });
		}

		const payload = verifyToken(token);

		if (!payload) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid or Expired Token" });
		}

		const user = await User.findOne({ UUID: payload.userUUID });

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found" });
		}

		return res.status(200).json({
			success: true,
			user: {
				UUID: user.UUID,
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});
	} catch (error) {
		console.error("Error fetching session:", error);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
});
