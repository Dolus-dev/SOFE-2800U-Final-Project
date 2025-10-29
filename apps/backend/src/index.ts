import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:3000",
	})
);

const PORT = 3001;

async function startServer() {
	try {
		app.listen(PORT, () => {
			console.info(`API service is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		process.exit();
	}
}

startServer();
