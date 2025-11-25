import express from "express";
import { verifyToken } from "../../../lib/setSessionToken";
import { Category } from "../../../lib/models";

export const router = express.Router();

router.get("/", async (req, res) => {
	const token = req.cookies["session_token"];

	const payload = verifyToken(token);
	if (!payload) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const userId = payload.userUUID;

	const categories = await Category.find({ userId });

	console.log(categories.map((cat) => cat.name));

	return res.status(200).json({
		success: true,
		categories: categories.map((cat) => cat.name) ?? [],
	});
});
