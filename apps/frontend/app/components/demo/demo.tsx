"use client";

import { useMemo, useState } from "react";
import Stat from "./components/Stat";
import Filter from "./components/Filter";
import Modal from "../Modal";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export type Status = "pending" | "in-progress" | "completed";
export type Priority = "low" | "medium" | "high" | "urgent";

type Task = {
	id: string;
	title: string;
	description?: string;
	category: string;
	status: Status;
	priority: Priority;
	dueDate?: string; // ISO date string
};

const nowISO = new Date().toISOString();
const addDaysISO = (dateISO: string, days: number) => {
	const date = new Date(dateISO);
	date.setDate(date.getDate() + days);
	return date.toISOString();
};

function relativeDue(due?: string) {
	if (!due) return "";

	const now = Date.now();
	const dueTime = new Date(due).getTime();
	const difference = dueTime - now;
	const absDiff = Math.abs(difference);
	const days = Math.floor(absDiff / (24 * 60 * 60 * 1000));
	const hours = Math.floor(
		(absDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
	);

	const daysSegment = days > 0 ? `${days}d ` : "";
	const hoursSegment = hours > 0 ? `${hours}h` : "";
	const segment =
		days > 0 ? `${daysSegment}${hoursSegment}` : `${hoursSegment}`;
	return difference < 0 ? `Overdue by ${segment}` : `Due in ${segment}`;
}

export default function Demo() {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: crypto.randomUUID(),
			title: "Complete SOFE-2800U Final Project",
			description:
				"Finish the coding, testing, and documentation for the final project.",
			status: "in-progress",
			priority: "high",
			dueDate: addDaysISO(nowISO, 5),
			category: "School",
		},
		{
			id: crypto.randomUUID(),
			title: "Prepare SOFE-1800U Presentation",
			description:
				"Create slides and practice the presentation for SOFE-1800U.",
			status: "pending",
			priority: "medium",
			dueDate: addDaysISO(nowISO, 10),
			category: "School",
		},
		{
			id: crypto.randomUUID(),
			title: "Grocery Shopping",
			description: "Milk, Eggs, Bread, Fruits, Vegetables",
			status: "pending",
			priority: "low",
			dueDate: addDaysISO(nowISO, 3),
			category: "Personal",
		},
		{
			id: crypto.randomUUID(),
			title: "Workout Session",
			status: "completed",
			priority: "medium",
			dueDate: addDaysISO(nowISO, -1),
			category: "Health",
		},
		{
			id: crypto.randomUUID(),
			title: "Refactor task list UI",
			description:
				"Improve the responsiveness and accessibility of the task list component.",
			status: "in-progress",
			priority: "urgent",
			dueDate: addDaysISO(nowISO, -4),
			category: "Work",
		},
	]);

	// UI state

	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
	const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
	const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">(
		"dueDate"
	);

	// Quick add form

	const categories = useMemo(
		() => ["all", ...Array.from(new Set(tasks.map((t) => t.category)))],
		[tasks]
	);

	const filtered = useMemo(() => {
		const priorityRank: Record<Priority, number> = {
			urgent: 0,
			high: 1,
			medium: 2,
			low: 3,
		};
		const statusRank: Record<Status, number> = {
			"in-progress": 0,
			pending: 1,
			completed: 2,
		};
		return tasks
			.filter((task) => {
				const matchQuery =
					!query ||
					task.title.toLowerCase().includes(query.toLowerCase()) ||
					(task.description || "").toLowerCase().includes(query.toLowerCase());
				const matchS = statusFilter === "all" || task.status === statusFilter;
				const matchP =
					priorityFilter === "all" || task.priority === priorityFilter;
				const matchC =
					categoryFilter === "all" || task.category === categoryFilter;
				return matchQuery && matchS && matchP && matchC;
			})
			.sort((a, b) => {
				if (sortBy === "dueDate") {
					const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
					const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
					return ad - bd;
				}
				if (sortBy === "priority") {
					return priorityRank[a.priority] - priorityRank[b.priority];
				}
				return statusRank[a.status] - statusRank[b.status];
			});
	}, [tasks, query, statusFilter, priorityFilter, categoryFilter, sortBy]);

	const stats = useMemo(() => {
		const total = tasks.length;
		const completed = tasks.filter((t) => t.status === "completed").length;
		const pending = tasks.filter((t) => t.status === "pending").length;
		const inProgress = tasks.filter((t) => t.status === "in-progress").length;
		return { total, completed, pending, inProgress };
	}, [tasks]);

	const grouped = useMemo(() => {
		const cols: Record<Status, Task[]> = {
			pending: [],
			"in-progress": [],
			completed: [],
		};

		filtered.forEach((task) => {
			cols[task.status].push(task);
		});
		return cols;
	}, [filtered]);

	function changeStatus(taskId: string, newStatus: Status) {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === taskId
					? {
							...t,
							status: newStatus,
						}
					: t
			)
		);
	}

	function addTask(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const rawFormData = {
			title: String(formData.get("task-title")).trim(),
			description: String(formData.get("task-description")).trim(),
			category: String(formData.get("task-category")).trim() || "Uncategorized",
			priority: String(formData.get("task-priority")).trim() as Priority,
			dueDate: String(formData.get("task-due-date")).trim(),
		};

		if (!rawFormData.title) {
			return alert("Task title is required.");
		}
		const newTask: Task = {
			id: crypto.randomUUID(),
			title: rawFormData.title,
			description: rawFormData.description || undefined,
			category: rawFormData.category || "Uncategorized",
			status: "pending",
			priority: rawFormData.priority || "medium",
			dueDate: rawFormData.dueDate
				? new Date(rawFormData.dueDate).toISOString()
				: undefined,
		};
		console.log(newTask);
		setTasks((prev) => [newTask, ...prev]);
		setShowModal(false);
		e.currentTarget.reset();
	}

	function deleteTask(taskId: string) {
		setTasks((prev) => prev.filter((t) => t.id !== taskId));
	}

	function resetDemo() {
		window.location.reload();
	}

	const [showModal, setShowModal] = useState(false);
	return (
		<>
			<section className="w-full max0w07xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="mb-4">
					<h3 className="text-2xl font-bold text-lightText dark:text-darkText">
						Demo Dashboard
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-300">
						Preview how tasks look and feel. Demo data only; nothing is saved.
					</p>
				</header>

				{/* Stats */}

				<section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<Stat
						label="Total"
						value={stats.total}
					/>
					<Stat
						label="Pending"
						value={stats.pending}
						accent="text-gray-800 dark:text-gray-100"
					/>
					<Stat
						label="In Progress"
						value={stats.inProgress}
						accent="text-gray-800 dark:text-gray-100"
					/>
					<Stat
						label="Completed"
						value={stats.completed}
						accent="text-gray-800 dark:text-gray-100"
					/>
				</section>

				{/* Controls */}
				<section className="mt-6 rounded-xl p-4 border border-black/10 dark:border-white/10 bg-lightSecondary dark:bg-darkSecondary">
					<div className="grid gap-4 md:grid-cols-6">
						<div className="md:col-span-2">
							<label className="text-xs font-medium mb-1 block">Search</label>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search tasks..."
								className="w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1 text-sm"
							/>
						</div>
						<Filter
							label="Status"
							value={statusFilter}
							onChange={(v) => setStatusFilter(v as Status)}
							options={["all", "pending", "in-progress", "completed"]}
						/>
						<Filter
							label="Priority"
							value={priorityFilter}
							onChange={(v) => setPriorityFilter(v as Priority)}
							options={["all", "urgent", "high", "medium", "low"]}
						/>
						<Filter
							label="Category"
							value={categoryFilter}
							onChange={(v) => setCategoryFilter(v)}
							options={categories}
						/>
						<Filter
							label="Sort"
							value={sortBy}
							onChange={(v) => setSortBy(v as "dueDate" | "priority" | "title")}
							options={[
								{ key: "Due Date", value: "dueDate" },
								{ key: "Priority", value: "priority" },
								{ key: "Title", value: "title" },
							]}
						/>
						<div className="flex items-end gap-2">
							<button
								onClick={resetDemo}
								className="px-3 py-2 rounded-md hover:cursor-pointer bg-gray-500/20 text-sm hover:bg-gray-500/30">
								Reset
							</button>
						</div>
					</div>
				</section>

				<section className="mt-2 rounded-xl p-2 border border-black/10 dark:border-white/10 bg-lightSecondary dark:bg-darkSecondary">
					<button
						className="px-3 w-full py-2 rounded-md hover:cursor-pointer bg-gray-500/20 text-lg align-middle hover:bg-gray-500/30"
						onClick={() => setShowModal(true)}>
						<PlusCircleIcon className="size-8 inline-block mr-2 shrink-0" />
						Add Task
					</button>
				</section>

				{/* Columns */}

				<section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
					{(["pending", "in-progress", "completed"] as Status[]).map((col) => (
						<div
							key={col}
							className="rounded-xl border border-black/10 dark:border-white/10 bg-lightSecondary dark:bg-darkSecondary p-3">
							<div className="flex items-center justify-between mb-2">
								<h4 className="font-semibold capitalize text-lightText dark:text-darkText">
									{col.replace("-", " ")}
								</h4>
								<span className="text-xs text-gray-500">
									{grouped[col].length}
								</span>
							</div>

							<div className="space-y-3">
								{grouped[col].length === 0 && (
									<p className="text-sm text-gray-500">No tasks</p>
								)}
								{grouped[col].map((task) => {
									const overdue =
										task.dueDate &&
										new Date(task.dueDate).getTime() < Date.now() &&
										task.status !== "completed";

									return (
										<div
											key={task.id}
											className="rounded-xl p-3 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 backdrop-blur hover:border-accent/50 transition-all">
											{/* Header with title and delete button */}
											<div className="flex items-start justify-between gap-2 mb-2">
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2 flex-wrap">
														<h5 className="font-semibold text-lightText dark:text-darkText">
															{task.title}
														</h5>
														<span className="px-2 py-0.5 rounded text-xs capitalize font-semibold bg-gray-500/10 text-gray-700">
															{task.priority}
														</span>
													</div>
													{task.description && (
														<p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
															{task.description}
														</p>
													)}
												</div>

												{/* Delete button */}
												<button
													onClick={() => deleteTask(task.id)}
													className="shrink-0 p-1 rounded hover:bg-red-500/20 text-red-600 hover:cursor-pointer hover:text-red-700 transition-colors"
													title="Delete task">
													<XMarkIcon className="w-5 h-5" />
												</button>
											</div>

											{/* Category and due date info */}
											<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
												<span className="px-1.5 py-0.5 rounded bg-gray-500/10">
													{task.category}
												</span>
												{task.dueDate && (
													<>
														<span className="px-1.5 py-0.5 rounded bg-gray-500/10">
															Due: {new Date(task.dueDate).toLocaleDateString()}
														</span>
														<span
															className={`px-1.5 py-0.5 rounded ${
																overdue
																	? "bg-red-500/20 text-red-700 font-medium"
																	: "bg-amber-500/20 text-amber-700"
															}`}>
															{relativeDue(task.dueDate)}
														</span>
													</>
												)}
											</div>

											{/* Status change buttons */}
											<div className="mt-3 flex gap-2 flex-wrap">
												{task.status !== "pending" && (
													<button
														onClick={() => changeStatus(task.id, "pending")}
														className="px-3 py-1 rounded text-xs font-medium bg-gray-500/20 hover:cursor-pointer hover:bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/30 transition-colors">
														Mark Pending
													</button>
												)}
												{task.status !== "in-progress" && (
													<button
														onClick={() => changeStatus(task.id, "in-progress")}
														className="px-3 py-1 rounded text-xs font-medium bg-blue-500/20 hover:cursor-pointer hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 border border-blue-500/30 transition-colors">
														Mark In Progress
													</button>
												)}
												{task.status !== "completed" && (
													<button
														onClick={() => changeStatus(task.id, "completed")}
														className="px-3 py-1 rounded text-xs font-medium bg-emerald-500/20 hover:cursor-pointer hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-colors">
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
			</section>

			{/* Add Task Modal */}

			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}>
				<header className="bg-lightSecondary ">
					<h3 className="text-2xl font-bold text-lightText dark:text-darkText pl-4 py-2">
						Add New Task
					</h3>
				</header>
				<main>
					<form
						onSubmit={addTask}
						className="flex flex-col gap-4 mx-3 my-2">
						<div>
							<label
								htmlFor="task-title"
								className="text-sm font-medium mb-1 block text-lightText dark:text-darkText">
								Title *
							</label>
							<input
								id="task-title"
								name="task-title"
								type="text"
								placeholder="Enter task title..."
								required
								className="w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1.5 text-lightText dark:text-darkText"
							/>
						</div>

						<div>
							<label
								htmlFor="task-description"
								className="text-sm font-medium mb-1 block text-lightText dark:text-darkText">
								Description
							</label>
							<textarea
								id="task-description"
								name="task-description"
								placeholder="Enter task description..."
								rows={3}
								className="w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1.5 text-lightText dark:text-darkText resize-none"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="task-category"
									className="text-sm font-medium mb-1 block text-lightText dark:text-darkText">
									Category
								</label>
								<input
									id="task-category"
									name="task-category"
									type="text"
									placeholder="e.g., Work, Personal"
									className="w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1.5 text-lightText dark:text-darkText"
								/>
							</div>

							<div>
								<label
									htmlFor="task-priority"
									className="text-sm font-medium mb-1 block text-lightText dark:text-darkText">
									Priority
								</label>
								<select
									id="task-priority"
									name="task-priority"
									defaultValue="medium"
									className="w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1.5 text-lightText dark:text-darkText">
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
									<option value="urgent">Urgent</option>
								</select>
							</div>
						</div>

						<div>
							<label
								htmlFor="task-due-date"
								className="text-sm font-medium mb-1 block text-lightText dark:text-darkText">
								Due Date
							</label>
							<input
								id="task-due-date"
								name="task-due-date"
								type="date"
								className="w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1.5 text-lightText dark:text-darkText"
							/>
						</div>

						<div className="flex gap-3 justify-end mt-2">
							<button
								type="button"
								onClick={() => setShowModal(false)}
								className="px-4 py-2 rounded-md bg-gray-500/20 hover:bg-gray-500/30 text-lightText dark:text-darkText">
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 rounded-md bg-accent hover:brightness-95 text-black font-medium">
								Add Task
							</button>
						</div>
					</form>
				</main>
			</Modal>
		</>
	);
}
