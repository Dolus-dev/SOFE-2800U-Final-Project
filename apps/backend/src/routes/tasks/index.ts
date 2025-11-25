import express from "express";
import { router as statsRouter } from "./stats";
import { router as categoriesRouter } from "./categories";

export const router = express.Router();

router.use("/stats", statsRouter);
router.use("/catagories", categoriesRouter);

router.post("/", (req, res) => {
	const { title, description, categoryId, priority, dueDate } = req.body;

	console.log(req.body);
});
