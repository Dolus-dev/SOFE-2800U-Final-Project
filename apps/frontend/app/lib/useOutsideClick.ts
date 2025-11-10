import { useEffect, useRef } from "react";

/**
 * Executes desired logic when a click is registered outside the target element.
 * @param callback The function containing the desired logic to be executed when an outside element is clicked
 * @example  useOutsideClick(()=> console.log("Hello World"))
 * @returns {void}
 */
export default function useOutsideClick(callback: () => void) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener("mouseup", handleClickOutside);
		document.addEventListener("touchend", handleClickOutside);

		return () => {
			document.removeEventListener("mouseup", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		};
	}, [callback]);

	return ref;
}
