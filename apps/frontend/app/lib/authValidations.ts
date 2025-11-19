import { Email } from "./types/types";

/**
 * Verifies whether a given string adheres to a valid email format
 * @param value The string to verify if it is in valid Email format
 * @returns Boolean
 */
export function isValidEmail(value: string): value is Email {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(value);
}
