import { mutate } from "swr";

const TASKS_STATS_URL = "http://localhost:3001/tasks/stats";
const TASKS_URL = "http://localhost:3001/tasks";
const TASKS_CATEGORIES = "http://localhost:3001/tasks/catagories";

function refreshTaskData() {
	mutate(TASKS_STATS_URL);
	mutate(TASKS_URL);
	mutate(TASKS_CATEGORIES);
}

export async function createTask(taskData: {
	title: string;
	description?: string;
	categoryName?: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "pending" | "in-progress" | "completed";
	dueDate?: string;
}) {
	const res = await fetch(TASKS_URL, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(taskData),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || `HTTP ${res.status}`);
	}
	refreshTaskData();
	return res.json();
}

export async function updateTask(
	taskId: string,
	updates: Partial<{
		title: string;

		description: string;
		categoryId: string;
		priority: "low" | "medium" | "high" | "urgent";
		status: "pending" | "in-progress" | "completed";
		dueDate: Date;
	}>
) {
	const res = await fetch(`${TASKS_URL}/${taskId}`, {
		method: "PATCH",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updates),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || `HTTP ${res.status}`);
	}

	refreshTaskData();
	return res.json();
}

export async function deleteTask(taskId: string) {
	const res = await fetch(`${TASKS_URL}/${taskId}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || `HTTP ${res.status}`);
	}

	refreshTaskData();
	return res.json();
}
