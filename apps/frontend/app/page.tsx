import AuthModalHandler from "./components/Header/AuthModalHandler/AuthModalHandler";
import SessionDropdown from "./components/Header/SessionDropdown";
import ThemeToggler from "./components/Header/ThemeToggler";

// This is the landing page for the TODO List
export default function Home() {
	return (
		<div className="flex flex-col h-dvh justify-between  ">
			<header className=" relative text-lightText   bg-lightSecondary flex flex-row justify-end gap-6 dark:bg-darkSecondary border-b-accent border-b-2 transition-colors duration-500">
				<div className="absolute -top-1 left-4">
					<ThemeToggler />
				</div>
				<AuthModalHandler />
				<SessionDropdown />
			</header>

			<main className="mb-auto h-full bg-lightPrimary dark:bg-darkPrimary transition-colors duration-500">
				<div className="flex flex-col items-center justify-center">
					<h1 className="font-bold text-lightText dark:text-darkText transition-colors duration-500 text-5xl sm:text-6xl md:text-8xl lg:text-9xl mt-20 sm:mt-25 md:mt-25 lg:mt-40">
						Tick-It
					</h1>
					<h2 className="font-semibold dark:text-darkText text-lightText transition-colors duration-500 text-3xl sm:text-4xl md:text-6xl lg:text-7xl mt-8">
						Got it done? Just Tick-it.
					</h2>
				</div>
			</main>
			<footer className="bg-lightSecondary text-lightText   dark:bg-darkSecondary flex flex-col transition-colors duration-500">
				<div className="place-self-center">
					<p> Tick-It &copy; 2025</p>
				</div>
			</footer>
		</div>
	);
}
