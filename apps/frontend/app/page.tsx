import { InformationCircleIcon } from "@heroicons/react/24/solid";
import Demo from "./components/demo/Demo";
import BouncingArrow from "./components/animations/bouncingArrow";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center py-4 relative">
			<div className="flex flex-col items-center justify-center lg:max-w-[90%] xl:max-w-[90%]">
				<h1 className="font-bold text-lightText dark:text-darkText transition-colors duration-500 text-5xl sm:text-6xl md:text-8xl lg:text-9xl mt-20 sm:mt-25 md:mt-25 lg:mt-40">
					Tick-It
				</h1>
				<h2 className="font-semibold dark:text-darkText text-lightText transition-colors duration-500 text-3xl sm:text-4xl md:text-6xl lg:text-7xl mt-8">
					Got it done? Just Tick-it.
				</h2>
				<div className="flex flex-row text-center justify-center relative flex-wrap gap-x-12 gap-y-8 mt-10">
					<div className="flex flex-row text-lightPrimary max-w-[30%] transition-colors duration-500 lg:w-auto relative items-center font-semibold gap-2 p-2 bg-lightSecondary dark:bg-darkSecondary rounded-xl">
						<InformationCircleIcon className="size-8 shrink-0 text-lightPrimary" />
						<span className="text-wrap shrink">
							Keep track of your work from anywhere!
						</span>
					</div>
					<div className="flex flex-row text-lightPrimary transition-colors duration-500 items-center font-semibold gap-2 p-2 bg-lightSecondary dark:bg-darkSecondary rounded-xl">
						<InformationCircleIcon className="size-8 shrink-0 text-lightPrimary" />
						<span className="">Organize by priority!</span>
					</div>
					<div className="flex flex-row text-lightPrimary transition-colors duration-500 items-center font-semibold gap-2 p-2 bg-lightSecondary dark:bg-darkSecondary rounded-xl">
						<InformationCircleIcon className="size-8 shrink-0 text-lightPrimary" />
						<span className="">Deadline notifications!</span>
					</div>
				</div>
				<div className="mt-90 flex flex-row text-lightText dark:text-darkText transition-colors duration-500 items-center font-semibold text-xl gap-2 p-2">
					<BouncingArrow />
					Try It Yourself! <BouncingArrow />
				</div>
			</div>
			<hr className="bg-lightSecondary dark:bg-darkSecondary border-0 h-0.5 w-full mb-16 transition-colors duration-500" />

			<div className="mt-10 w-full">
				<Demo />
			</div>
		</div>
	);
}
