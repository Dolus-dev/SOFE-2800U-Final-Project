import express from "express";
import { Task } from "../../../lib/models";
import { verifyToken } from "../../../lib/setSessionToken";

export const router = express.Router();

router.get("/", async (req, res) => {
	const token = req.cookies["session_token"];
	verifyToken(token);
	const payload = verifyToken(token);
	if (!payload) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}
	const now = new Date();

	const userId = payload.userUUID;

	const [stats] = await Task.aggregate([
		{ $match: { userId } },
		{
			$facet: {
				total: [{ $count: "count" }],
				completed: [{ $match: { status: "completed" } }, { $count: "count" }],
				overdue: [
					{
						$match: {
							status: { $ne: "completed" },
							dueDate: { $lt: now },
						},
					},
					{ $count: "count" },
				],
				pending: [{ $match: { status: "pending" } }, { $count: "count" }],
				inProgress: [
					{ $match: { status: "in-progress" } },
					{ $count: "count" },
				],
			},
		},
	]);

	const totalTasks = stats.total[0]?.count || 0;
	const completedTasks = stats.completed[0]?.count || 0;

	return res.status(201).json({
		success: true,
		stats: {
			userId,
			totalTasks,
			completedTasks,
			pendingTasks: stats.pending[0]?.count || 0,
			inProgressTasks: stats.inProgress[0]?.count || 0,
		},
	});
});
