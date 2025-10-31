import express from "express";

export const router = express.Router();

router.get("/", (req, res) => {
	res.send("This is an example response using the GET method");
});

router.post("/", (req, res) => {
	res.send("This is an example response using the POST method");
});

router.delete("/", (req, res) => {
	res.send("This is an example response using the DELETE method");
});

/**And so on for other REST fetch methods
 *
 * Generally takes the form of:
 * router.{rest method}('{route}', (req, res) => {...})
 */
