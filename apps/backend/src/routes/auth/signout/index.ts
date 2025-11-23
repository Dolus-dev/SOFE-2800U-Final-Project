import express from "express";
import "dotenv/config";
import { clearSessionToken } from "../../../lib/setSessionToken";

export const router = express.Router();

router.post("/", (req, res) => {
	clearSessionToken(res);
	return res
		.status(200)
		.json({ success: true, message: "Signed out successfully" });
});
