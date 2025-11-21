"use client";

import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

export default function AuthModalHandler() {
	return (
		<>
			<LoginModal />
			<RegisterModal />
		</>
	);
}
