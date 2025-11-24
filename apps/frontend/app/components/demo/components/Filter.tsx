"use client";

type SortOptions = {
	key: "Due Date" | "Priority" | "Title";
	value: "dueDate" | "priority" | "title";
};

export default function Filter({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (newValue: string) => void;
	options: SortOptions[] | string[];
}) {
	return (
		<div>
			<label className="text-xs font-medium mb-1 block">{label}</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full border-2 rounded-md border-black hover:cursor-pointer bg-gray-400/20 dark:bg-black/20 px-2 py-1 text-sm">
				{options.map((o) => (
					<option
						className="text-lightText hover:cursor-pointer dark:text-darkText"
						key={typeof o === "string" ? o : o.key}
						value={typeof o === "string" ? o : o.value}>
						{typeof o === "string" ? o : o.key}
					</option>
				))}
			</select>
		</div>
	);
}
