import SessionDropdown from "./components/Header/SessionDropdown";

// This is the landing page for the TODO List
export default function Home() {
	return (
		<div className="flex flex-col h-dvh justify-between text-black ">
			<header className=" bg-lightSecondary flex flex-row justify-end border-b-accent border-b-2">
				<SessionDropdown />
			</header>
			<main className="mb-auto h-full bg-lightPrimary">
				<div className="flex flex-col items-center justify-center">
					<h1 className="font-bold text-lightText text-5xl sm:text-6xl md:text-8xl lg:text-9xl mt-20 sm:mt-25 md:mt-25 lg:mt-40">
						Tick-It
					</h1>
					<h2 className="font-semibold text-lightText text-3xl sm:text-4xl md:text-6xl lg:text-7xl mt-8">
						Got it done? Just Tick-it.
					</h2>
				</div>
			</main>
			<footer className="bg-lightSecondary  flex flex-col">
				<div className="place-self-center">
					<p> Tick-It &copy; 2025</p>
				</div>
			</footer>
		</div>
	);
}
