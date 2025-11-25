"use client";

import useSWR from "swr";

interface TaskStats {
	userId: string;
	totalTasks: number;
	completedTasks: number;
	pendingTasks: number;
	inProgressTasks: number;
}

interface StatsResponse {
	success: boolean;
	stats: TaskStats;
}

const fetcher = async (url: string): Promise<StatsResponse> => {
	const res = await fetch(url, {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) {
		console.log(await res.json());
		throw new Error(`HTTP ${res.status}`);
	}

	return res.json();
};

export default function TaskStats() {
	const { data, error, isLoading } = useSWR<StatsResponse>(
		["http://localhost:3001/tasks/stats"],
		fetcher,
		{ revalidateOnFocus: false }
	);

	if (isLoading) {
		return (
			<section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="rounded-xl p-3 border border-black/10 dark:border-white/10 bg-lightSecondary dark:bg-darkSecondary animate-pulse">
						<div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
						<div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
					</div>
				))}
			</section>
		);
	}

	if (error || !data?.success) {
		return (
			<section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
				<div className="col-span-full rounded-xl p-3 border border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400 text-sm">
					Failed to load statistics. Please try again later.
				</div>
			</section>
		);
	}

	const stats = data.stats;

	return (
		<section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
			<StatCard
				label="Total"
				value={stats.totalTasks}
			/>
			<StatCard
				label="Pending"
				value={stats.pendingTasks}
			/>
			<StatCard
				label="In Progress"
				value={stats.inProgressTasks}
			/>
			<StatCard
				label="Completed"
				value={stats.completedTasks}
			/>
		</section>
	);
}

interface StatCardProps {
	label: string;
	value: number;
	accentColor?: string;
}

function StatCard({ label, value, accentColor }: StatCardProps) {
	return (
		<div className="rounded-xl p-3 border border-black/10 dark:border-white/10 bg-lightSecondary dark:bg-darkSecondary">
			<p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
				{label}
			</p>
			<p
				className={`text-2xl font-bold ${accentColor || "text-lightText dark:text-darkText"}`}>
				{value}
			</p>
		</div>
	);
}
