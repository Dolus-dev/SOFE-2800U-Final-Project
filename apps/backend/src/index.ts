import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { router as baseMiddleWare } from "./middlewares/base-middleware";
import { router as baseRouter } from "./routes/base-router";

/**Initializing Express */
const app = express();
app.use(cookieParser()); /** Allows us to use cookie */
app.use(
	cors({
		/**Allows us to send data from backend to frontend when requested */
		credentials: true,
		origin: "http://localhost:3000",
	})
);
app.use("/", baseMiddleWare);
app.use("/", baseRouter);

const PORT = 3001;

if (!process.env.MONGODB_URL) {
	throw new Error("One or more environment variables are not defined!");
}

const DATABASE_URL = process.env.MONGODB_URL;

async function startServer() {
	try {
		/**app.listen() should be the LAST thing that is ran in the try block
		 * Initialize DB or something(?)
		 */

		await mongoose.connect(DATABASE_URL);
		console.log("Established connection to the database.");
		app.listen(PORT, () => {
			console.info(`API service is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Failed to connect to MongoDB", error);
		process.exit();
	}
}

startServer();
