"use client";

import { AnimatePresence, motion, Variants } from "motion/react";
import { useState } from "react";
import Card from "../Card";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Modal from "../Modal";

const demoVariants: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: {
			type: "spring",
			bounce: 0.2,
			duration: 5000,
			opacity: { ease: "linear" },
		},
	},
};

export default function Demo() {
	const [tableData, setTableData] = useState<
		Array<{ task: string; due: Date | null; completed: boolean }>
	>([
		{ task: "Complete Project", due: new Date(2025, 11, 1), completed: false },
		{ task: "Study for Exams", due: null, completed: false },
	]);

	const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
	const handleComplete = (item: (typeof tableData)[0]) => {
		setTableData(
			tableData.map((row) =>
				row.task === item.task ? { ...row, completed: !row.completed } : row
			)
		);
	};

	return (
		<>
			<motion.div
				layout
				variants={demoVariants}
				initial="hidden"
				whileInView="visible"
				className="">
				<Card>
					<table className="min-w-3xl text-lightText dark:text-darkText transition-colors duration-500 table-auto">
						<thead className="bg-lightSecondary dark:bg-darkSecondary transition-colors duration-500 ">
							<tr className="">
								<th className="py-2">Task</th>
								<th className="py-2">Due</th>
								<td></td>
							</tr>
						</thead>
						<motion.tbody
							layout
							className="">
							<AnimatePresence>
								{tableData.map((item, index) => (
									<motion.tr
										key={item.task}
										layout
										variants={demoVariants}
										initial="hidden"
										whileInView="visible"
										exit="hidden"
										className={`${index % 2 === 0 ? "bg-[#F9C390] dark:bg-darkBackground" : " bg-[#FEF2E7]"} relative not-last:border-b border-lightSecondary dark:border-darkSecondary transition-colors duration-500`}>
										<td className="px-4 py-2  ">
											<span className={item.completed ? "opacity-50" : ""}>
												{item.task}
											</span>
											<AnimatePresence>
												{item.completed && (
													<motion.div
														layoutId={`strikethrough-${item.task}`}
														initial={{
															scaleX: 0,
															transformOrigin: "left center",
														}}
														animate={{
															scaleX: 1,
															transformOrigin: "left center",
														}}
														exit={{
															scaleX: 0,
															transformOrigin: "right center",
														}}
														transition={{ duration: 0.5, ease: "easeInOut" }}
														className="absolute left-0 top-1/2 z-10 h-0.5 bg-black dark:bg-white origin-left w-full"
													/>
												)}
											</AnimatePresence>
										</td>
										<td className="px-4 py-2 text-center">
											{item.due ? (
												<time
													dateTime={item.due.toLocaleDateString()}
													suppressHydrationWarning>
													{item.due.toLocaleDateString()}
												</time>
											) : (
												"N/A"
											)}
										</td>
										<td className="px-4 py-2 text-center">
											<button
												onClick={() => handleComplete(item)}
												className={` ${item.completed ? "bg-green-500 hover:bg-green-600" : "bg-accent hover:bg-accentDark"} text-white font-bold py-1 px-3 rounded transition-colors duration-300 ${item.completed ? "opacity-50" : ""}`}>
												{item.completed ? "Undo" : "Complete"}
											</button>
										</td>
									</motion.tr>
								))}
								<tr>
									<td colSpan={3}>
										<div className="flex flex-row justify-center py-2">
											<button
												onClick={() => setIsNewTaskModalOpen(true)}
												className="rounded-xl border-2 hover:cursor-pointer bg-accent border-black flex flex-row items-center gap-2 px-4 py-2 text-white font-bold hover:bg-accentDark transition-colors duration-300">
												<PlusCircleIcon className="size-6 shrink-0" />
												New Task
											</button>
										</div>
									</td>
								</tr>
							</AnimatePresence>
						</motion.tbody>
					</table>
				</Card>
			</motion.div>

			<AnimatePresence>
				<Modal
					isOpen={isNewTaskModalOpen}
					onClose={() => {
						setIsNewTaskModalOpen(false);
					}}>
					<div className="">
						<form
							action={() => {
								setTableData([
									...tableData,
									{
										task: (
											document.getElementById("taskName") as HTMLInputElement
										).value,
										due: (
											document.getElementById("dueDate") as HTMLInputElement
										).value
											? new Date(
													(
														document.getElementById(
															"dueDate"
														) as HTMLInputElement
													).value
												)
											: null,
										completed: false,
									},
								]);
								setIsNewTaskModalOpen(false);
							}}>
							<h2 className="text-2xl font-bold mb-4 bg-lightSecondary p-4">
								Add New Task
							</h2>
							<div className="mb-4 p-4">
								<label className="block text-lightText dark:text-darkText mb-2">
									Task Name
								</label>
								<input
									type="text"
									id="taskName"
									required
									className="w-full p-2 border border-gray-300 rounded  text-lightText"
									placeholder="Enter task name"
								/>
								<label className="block mt-8 text-lightText dark:text-darkText mb-2">
									Due Date (Optional)
								</label>
								<input
									id="dueDate"
									type="date"
									className="w-full p-2 border border-gray-300 rounded text-lightText"
									placeholder="Enter due date"
								/>

								<button
									type="submit"
									className="mt-6 mx-[35%] hover:cursor-pointer bg-accent hover:bg-accentDark text-white font-bold py-2 px-4 rounded transition-colors duration-300">
									Add Task
								</button>
							</div>
						</form>
					</div>
				</Modal>
			</AnimatePresence>
		</>
	);
}
