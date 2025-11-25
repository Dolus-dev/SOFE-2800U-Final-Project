import express from "express";
import { router as statsRouter } from "./stats";
import { router as categoriesRouter } from "./categories";
import { Category, Task } from "../../lib/models";
import { verifyToken } from "../../lib/setSessionToken";

export const router = express.Router();

router.use("/stats", statsRouter);
router.use("/catagories", categoriesRouter);

router.post("/", async (req, res) => {
	const { title, description, categoryName, priority, dueDate } = req.body;

	const token = req.cookies["session_token"];

	const payload = verifyToken(token);
	if (!payload) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	console.log(categoryName);

	const userId = payload.userUUID;
	const existingCategory = await Category.findOne({
		userId,
		name: categoryName,
	});

	let taskCategoryId: string = existingCategory ? existingCategory.id : "";

	console.log(new Date(dueDate));

	if (!existingCategory) {
		const newCategory = new Category({
			userId,
			name: categoryName,
			color: "#000000", // Default color
			icon: null, // Default
			isDefault: categoryName === "general" ? true : false,
		});
		await newCategory.save();

		taskCategoryId = newCategory.id;
	}

	const newTask = new Task({
		userId,
		title,
		description,
		categoryId: taskCategoryId,
		categoryName,
		priority,
		dueDate,
	});

	await newTask.save();

	return res.status(201).json({ success: true, task: newTask });
});

router.get("/", async (req, res) => {
	const token = req.cookies["session_token"];

	const payload = verifyToken(token);

	if (!payload) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const userId = payload.userUUID;

	const tasks = await Task.find({ userId });

	return res.status(200).json({
		success: true,
		tasks: tasks.map((task) => {
			return {
				id: task.id,
				title: task.title,
				description: task.description,
				categoryName: task.categoryName,
				priority: task.priority,
				status: task.status,
				dueDate: task.dueDate,
			};
		}),
	});
});

router.delete("/:taskId", async (req, res) => {
	const token = req.cookies["session_token"];
	const payload = verifyToken(token);
	if (!payload) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const { taskId } = req.params;
	const userId = payload.userUUID;

	await Task.deleteOne({ id: taskId, userId });

	return res.status(200).json({ success: true });
});

router.patch("/:taskId", async (req, res) => {
	const token = req.cookies["session_token"];

	const payload = verifyToken(token);

	if (!payload) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const { taskId } = req.params;
	const updates: Partial<{
		title: string;

		description: string;
		categoryId: string;
		priority: "low" | "medium" | "high" | "urgent";
		status: "pending" | "in-progress" | "completed";
		dueDate: Date;
	}> = req.body;

	const userId = payload.userUUID;

	const task = await Task.findOne({ id: taskId, userId });
	console.log(task);

	task?.set("status", updates.status ? updates.status : task.status);
	task?.set("priority", updates.priority ? updates.priority : task.priority);
	task?.set("title", updates.title ? updates.title : task.title);
	task?.set(
		"description",
		updates.description ? updates.description : task.description
	);
	task?.set("dueDate", updates.dueDate ? updates.dueDate : task.dueDate);

	console.log(updates);

	await task?.save();

	console.log(task);

	return res.status(200).json({ success: true, task });
});
