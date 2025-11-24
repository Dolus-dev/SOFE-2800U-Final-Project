"use client";

import { useUser } from "../UserProvider";
import AuthModalHandler from "./AuthModalHandler/AuthModalHandler";
import SessionDropdown from "./SessionDropdown";

export default function HeaderStatefulItems() {
	const { user, isLoading } = useUser();

	return (
		<>
			{isLoading ? (
				// Loading skeleton
				<div className="w-24 h-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
			) : user ? (
				// Show session dropdown when logged in
				<SessionDropdown />
			) : (
				// Show login/register buttons when logged out
				<AuthModalHandler />
			)}
		</>
	);
}
