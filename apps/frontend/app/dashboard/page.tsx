"use client";

import { redirect } from "next/navigation";
import Columns from "../components/dashboard/Columns";
import Controls from "../components/dashboard/Controls";
import Stats from "../components/dashboard/Stats";
import { useUser } from "../components/UserProvider";

export default function DashboardPage() {
	const { user, isLoading } = useUser();

	if (isLoading) {
		return (
			<div className="text-lightText dark:text-darkText min-h-250">
				Loading...
			</div>
		);
	}

	if (!user) {
		redirect("/");
	}

	return (
		<div className="min-h-dvh">
			<main className="container mx-auto px-4 py-6">
				<div className="mt-6">
					<Stats />
					<Controls />
					<Columns />
				</div>
			</main>
		</div>
	);
}
