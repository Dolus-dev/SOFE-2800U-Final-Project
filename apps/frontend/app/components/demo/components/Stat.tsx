"use client";

export default function Stat({
	label,
	value,
	accent,
}: {
	label: string;
	value: number;
	accent?: string;
}) {
	return (
		<div className="rounded-xl p-4 border border-black/10 dark:border-white/10 bg-lightSecondary dark:bg-darkSecondary">
			<div className="text-sm uppercase tracking-wide text-gray-800 font-semibold dark:text-gray-100">
				{label}
			</div>
			<div
				className={`mt-1 text-2xl font-bold ${accent || "text-lightText dark:text-darkText"}`}>
				{value}
			</div>
		</div>
	);
}
