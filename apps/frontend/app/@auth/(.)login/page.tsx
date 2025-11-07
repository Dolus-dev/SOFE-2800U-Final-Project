"use client";

import { useRouter } from "next/navigation";
export default function Page() {
	const router = useRouter();
	return (
		<div className="flex flex-row min-w-[20%] max-w-[80%]  object-center justify-center top-1/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl drop-shadow-black absolute ">
			<div className="  flex flex-col w-full justify-items-center ">
				<header className="bg-lightSecondary p-4 rounded-t-2xl font-semibold text-lightText justify-self-start align-middle">
					Sign into your account
				</header>
				<main className="rounded-b-2xl bg-lightPrimary flex flex-col ">
					<button
						onClick={() => {
							router.back();
						}}>
						Close modal
					</button>
				</main>
			</div>
		</div>
	);
}
