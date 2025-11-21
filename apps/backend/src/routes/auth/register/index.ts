import express from "express";
import "dotenv/config";

export const router = express.Router();

router.post("/", async (req, res) => {
	const registeringUserData = req.body;
	console.log(registeringUserData);

	res.status(200).json(`Request ok!`);
});
