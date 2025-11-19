import express from "express";
import "dotenv/config";

export const router = express.Router();

router.get("/", (req, res) => {
	res.send("This is the signin route");
});
