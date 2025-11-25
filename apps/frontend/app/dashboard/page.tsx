import Columns from "../components/dashboard/Columns";
import Controls from "../components/dashboard/Controls";
import Stats from "../components/dashboard/Stats";

export default function DashboardPage() {
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
