"use client";

import { useMemo } from "react";
import { Status } from "../demo/Demo";
import useSWR from "swr";
import { deleteTask, updateTask } from "@/app/lib/hooks/tasks";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Task = {
	title: string;
	description?: string;
	status: Status;
	priority: "low" | "medium" | "high" | "urgent";
	dueDate: string; // ISO string
	id: string;
	categoryName: string;
};

function parseDateString(dateStr: string) {
	// Plain date-only string -> treat as local date
	if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
		const [y, m, d] = dateStr.split("-").map(Number);
		return new Date(y, m - 1, d);
	}
	// UTC midnight ISO -> also treat as local date (avoid previous-day shift)
	const utcMidnightMatch = /^(\d{4})-(\d{2})-(\d{2})T00:00:00(\.000)?Z$/.exec(
		dateStr
	);
	if (utcMidnightMatch) {
		const [, y, m, d] = utcMidnightMatch;
		return new Date(Number(y), Number(m) - 1, Number(d));
	}
	// Fallback normal parsing
	return new Date(dateStr);
}

function relativeDue(due?: string, status?: Status): string {
	if (!due) return "";
	if (status === "completed") {
		return "Completed";
	}
	const dueDate = parseDateString(due);
	const dueTime = dueDate.getTime();
	const now = Date.now();
	const diff = dueTime - now;
	const abs = Math.abs(diff);
	const days = Math.floor(abs / 86400000);

	if (days === 0) {
		return "Due today";
	} else {
		return diff < 0 ? `Overdue by ${days} days` : `Due in ${days} days`;
	}
}

async function tasksFetcher(url: string): Promise<Task[]> {
	const res = await fetch(url, {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || `HTTP ${res.status}`);
	}

	const json = await res.json();

	return json.tasks;
}

export default function Columns() {
	const { data: tasksData } = useSWR<Task[]>(
		"http://localhost:3001/tasks",
		tasksFetcher
	);

	const groupedTasks = useMemo(() => {
		const cols: Record<Status, Task[]> = {
			pending: [],
			"in-progress": [],
			completed: [],
		};

		tasksData?.forEach((task) => {
			cols[task.status].push(task);
			console.log(task.dueDate);
		});
		return cols;
	}, [tasksData]);

	return (
		<section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
			{(["pending", "in-progress", "completed"] as Status[]).map((col) => (
				<div
					key={col}
					className="rounded-xl border border-black/10 dark:border-white/10 bg-lightSecondary dark:bg-darkSecondary p-3">
					<div>
						<h4 className="font-semibold capitalize text-lightText dark:text-darkText">
							{col.replace("-", " ")}
						</h4>
						<span className="text-xs text-gray-500">
							{groupedTasks[col].length}
						</span>
					</div>

					<div className="space-y-3">
						{groupedTasks[col].length === 0 && (
							<p className="text-sm text-gray-500">No tasks</p>
						)}
						{groupedTasks[col].map((task) => {
							const overdue =
								task.dueDate &&
								new Date(task.dueDate) < new Date() &&
								task.status !== "completed";
							return (
								<div
									key={task.id}
									className="rounded-xl p-3 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 backdrop-blur hover:border-accent/50 transition-all">
									{/* Header with title and delete button */}
									<div className="flex items-start justify-between gap-2 mb-2">
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2 flex-wrap">
												<h5 className="font-semibold text-lightText dark:textdarkText">
													{task.title}
												</h5>
												<span className="px-2 py-0.5 rounded text-xs capitalize font-semibold bg-gray-500/10 text-gray-700">
													{task.priority}
												</span>
											</div>
											{task.description && (
												<p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 ">
													{task.description}
												</p>
											)}
										</div>

										{/* Delete Button */}
										<button
											onClick={() => deleteTask(task.id)}
											className="shrink=0 p-1 rounded hover:bg-red-500/20 text-red-600 hover:cursor-pointer hover:text-red-700 transition-colors"
											title="Delete Task">
											<XMarkIcon className="h-5 w-5 size-5" />
										</button>
									</div>

									{/* Category and due date info */}
									<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
										<span className="px-1.5 py.0.5 rounded bg-gray-500/10">
											{task.categoryName}
										</span>
										{task.dueDate && (
											<>
												<span className="px-1.5 py-0.5 rounded bg-gray-500/10">
													Due:{" "}
													{Intl.DateTimeFormat("en-US", {
														dateStyle: "medium",
													}).format(parseDateString(task.dueDate))}
												</span>
												<span
													className={`px-1.5 py-0.5 rounded ${overdue ? "bg-red-500/20 text-red-700 font-medium" : col === "completed" ? "bg-green-500/20 text-green-700 font-medium" : "bg-amber-500/20 text-amber-700 font-medium"}`}>
													{relativeDue(task.dueDate, col)}
												</span>
											</>
										)}
									</div>

									{/* Status change buttons */}
									<div className="mt-3 flex gap-2 flex-wrap">
										{task.status !== "pending" && (
											<button
												onClick={() =>
													updateTask(task.id, { status: "pending" })
												}
												className="px-3 py-1 rounded text-xs font-medium bg-gray-500/20 hover:cursor-pointer hover:bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/30 transition-colors">
												Mark Pending
											</button>
										)}
										{task.status !== "in-progress" && (
											<button
												onClick={() =>
													updateTask(task.id, { status: "in-progress" })
												}
												className="px-3 py-1 rounded text-xs font-medium bg-gray-500/20 hover:cursor-pointer hover:bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/30 transition-colors">
												Mark In Progress
											</button>
										)}
										{task.status !== "completed" && (
											<button
												onClick={() =>
													updateTask(task.id, { status: "completed" })
												}
												className="px-3 py-1 rounded text-xs font-medium bg-gray-500/20 hover:cursor-pointer hover:bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/30 transition-colors">
												Mark Completed
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</section>
	);
}
