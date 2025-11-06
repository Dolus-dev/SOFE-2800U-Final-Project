"use client";

import useOutsideClick from "@/app/lib/useOutsideClick";
import {
	ArrowLeftStartOnRectangleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	UserCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";

// TODO: Change output depending on whether is logged in based on fetch call
// Above could be handled either in parent page or locally here

export default function SessionDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useOutsideClick(() => {
		setIsOpen(false);
	});

	return (
		<div
			className="flex flex-col relative"
			ref={dropdownRef}>
			<button
				className={`overflow-hidden flex flex-row z-10 items-center hover:cursor-pointer py-2 border-b-2 border-b-lightSecondary dark:border-b-darkSecondary transition-colors duration-500`}
				onClick={() => setIsOpen(!isOpen)}>
				<UserCircleIcon className="size-8" />
				<span className="px-2 mr-10">Test User</span>
				<div className={`transition-normal duration-500 `}>
					<ChevronDownIcon
						className={`  absolute  top-3 right-1 duration-500   transform ${
							isOpen ? "opacity-0 scale-25 rotate-90" : "opacity-100 scale-100"
						} size-6 `}
					/>
					<ChevronUpIcon
						className={` absolute transform top-3 right-1 duration-500 ${isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-25 rotate-90"} size-6 `}
					/>
				</div>
			</button>
			<div
				className={`flex flex-col absolute overflow-hidden w-full font-semibold justify-center border-b-2 border-b-accent bg-lightSecondary dark:bg-darkSecondary transition-all duration-500 top-full dark:text-darkText text-lightText ${isOpen ? "  max-h-[2em]" : " max-h-0 "}  transition-normal duration-500`}>
				<Link
					href={"/auth/signout"}
					className={`flex flex-row justify-center gap-2 hover:text-lightTextMuted  overflow-hidden py-1 transition-all duration-400`}>
					<ArrowLeftStartOnRectangleIcon className="size-6" />
					<span>Logout</span>
				</Link>
			</div>
		</div>
	);
}
