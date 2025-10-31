import { NextFunction, Request, Response } from "express";

export const middlewareExample = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// insert intended middleware logic here
		console.log(`Middleware fired`);
		return next();
	} catch (error) {
		// error handling here
	}

	// If request passes middleware logic, make sure to return next() at the end
	return next();
};
