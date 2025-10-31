"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

// This tells Next.js (React) that this is a client component
//Client components are useful for elements that a user may interact with.
// Client components cannot use async at the top level

export default function ClientExample() {
	/**
	 * Client components can also use tools like useState() and useEffect().
	 * If we need to make fetch calls in a client component. Do not use useEffect().
	 * Use useSWR() instead. it will prevent duplicate requests.
	 * Common methods/functions that are unique to client components are below.
	 */

	const [isOn, setIsOn] = useState(false);

	// NOT RECOMMENDED TO USE.
	useEffect(() => {});

	// USE THIS FOR FETCH API CALLS
	// Make sure to read the useSWR documentation here: https://swr.vercel.app/
	const { data, error, isLoading } = useSWR(() => {});
	/**
	 * data: fetch response. Need to error handle error status codes for errors to show in error
	 * error: by default return network errors if encountered. Status code errors (4**) need to be checked from data
	 * isLoading: returns a boolean for whether the request is still being processed or not
	 */

	return (
		<>
			<div className="border border-white">
				<button
					className={` hover:cursor-pointer ${isOn ? "bg-green-500" : "bg-red-500"} text-white`}
					onClick={() => setIsOn(!isOn)}>
					<p>{isOn ? "I am on!" : " I am off :("}</p>
				</button>
			</div>
		</>
	);
}
