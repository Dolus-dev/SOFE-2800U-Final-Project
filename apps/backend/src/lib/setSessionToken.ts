import jwt from "jsonwebtoken";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JWTPayload {
	userUUID: string;
	username: string;
}

export function generateToken(payload: JWTPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch (error) {
		return null;
	}
}
export function setSessionToken(res: Response, payload: JWTPayload): void {
	const token = generateToken(payload);

	const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
	res.cookie("session_token", token, {
		httpOnly: true,
		sameSite: "lax",
		maxAge: maxAge * 1000, // Convert to milliseconds
		path: "/",
	});
}

export function clearSessionToken(res: Response): void {
	res.clearCookie("session_token", {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
	});
}
