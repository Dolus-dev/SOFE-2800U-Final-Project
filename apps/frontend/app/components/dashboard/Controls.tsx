"use client";

import { useState } from "react";
import { Status, Priority } from "../demo/Demo";
import Filter from "../demo/components/Filter";
import useSWR from "swr";
import { PlusIcon } from "@heroicons/react/24/solid";
import Modal from "../Modal";
import { form } from "motion/react-client";
import { createTask } from "@/app/lib/hooks/tasks";

type SortOptions = {
	key: "Due Date" | "Priority" | "Title";
	value: "dueDate" | "priority" | "title";
};

export default function Controls() {
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
	const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
	const [sortBy, setSortBy] = useState<SortOptions["value"]>("dueDate");
	const [showModal, setShowModal] = useState(false);
	// Modal category controls
	const [categoryMode, setCategoryMode] = useState<"existing" | "new">(
		"existing"
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [newCategoryName, setNewCategoryName] = useState<string>("");

	const { data } = useSWR<{
		success: boolean;
		categories: string[];
	}>(
		"http://localhost:3001/tasks/catagories",
		async (url: string) => {
			const res = await fetch(url, {
				method: "GET",
				credentials: "include",
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}

			const json = await res.json();
			// Normalize to string[] of category names for this control
			type ApiCategory =
				| { id: string; name: string; color?: string; icon?: string }
				| string;
			const names: string[] = Array.isArray(json?.categories)
				? (json.categories as ApiCategory[])
						.map((c) => (typeof c === "string" ? c : c?.name))
						.filter((v): v is string => Boolean(v))
				: [];

			return { success: !!json?.success, categories: names } as {
				success: boolean;
				categories: string[];
			};
		},
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			refreshInterval: 0,
			revalidateIfStale: false,
			shouldRetryOnError: false,
			dedupingInterval: 60 * 60 * 1000,
		}
	);

	return (
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
					options={data?.categories ? ["all", ...data.categories] : ["all"]}
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
			</div>
			<div className="md:col-span-6 mt-4 flex items-end justify-between gap-2">
				<button
					onClick={() => {
						setQuery("");
						setStatusFilter("all");
						setPriorityFilter("all");
						setCategoryFilter("all");
						setSortBy("dueDate");
					}}
					className="px-3 py-2 rounded-md bg-gray-500/20 text-sm hover:cursor-pointer hover:bg-gray-500/30">
					Reset
				</button>
				<button
					onClick={() => setShowModal(true)}
					className="px-3 py-2 rounded-md align-middle flex flex-row gap-2 hover:cursor-pointer bg-accent text-black font-semibold text-sm  hover:brightness-95">
					<PlusIcon className="h-5 w-5 size-5 text-white" />
					Create New Task
				</button>
			</div>

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
						onSubmit={async (e) => {
							e.preventDefault();

							const formData = new FormData(e.currentTarget);

							const rawFormData = {
								title: String(formData.get("task-title")).trim(),
								description:
									String(formData.get("task-description")).trim() || undefined,
								category:
									String(formData.get("task-category")) === "__new__"
										? formData.get("task-category-new")?.toString().trim()
										: String(formData.get("task-category")).trim(),
								priority: String(
									formData.get("task-priority")
								).trim() as Priority,
								dueDate: new Date(String(formData.get("task-due-date")).trim()),
								status: "pending" as Status,
							};

							console.log(rawFormData);

							await createTask(rawFormData);
						}}
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
								<select
									id="task-category"
									name="task-category"
									value={
										categoryMode === "existing" ? selectedCategory : "__new__"
									}
									onChange={(e) => {
										const val = e.target.value;
										if (val === "__new__") {
											setCategoryMode("new");
										} else {
											setCategoryMode("existing");
											setSelectedCategory(val);
										}
									}}
									className="w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1.5 text-lightText dark:text-darkText">
									<option value="">Select category</option>
									{(data?.categories || []).map((name) => (
										<option
											key={name}
											value={name}>
											{name}
										</option>
									))}
									<option value={"general"}>General</option>
									<option value="__new__">+ Create Category</option>
								</select>
								{categoryMode === "new" && (
									<input
										id="task-category-new"
										name="task-category-new"
										type="text"
										placeholder="New category name"
										value={newCategoryName}
										onChange={(e) => setNewCategoryName(e.target.value)}
										className="mt-2 w-full border-2 rounded-md border-black bg-gray-400/20 dark:bg-black/20 px-2 py-1.5 text-lightText dark:text-darkText"
									/>
								)}
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
		</section>
	);
}
