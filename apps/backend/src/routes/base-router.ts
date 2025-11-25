import express from "express";
import { router as authRouter } from "./auth";
import { router as tasksRouter } from "./tasks";
// Import nested route handlers here, example below
// import {router as exampleRouteHandler} from './example/index';

export const router = express.Router();
//Example on how to tell express to use the nested route handlers for folder based structuring:
// router.use("/example", exampleRouteHandler)

router.use("/auth", authRouter);
router.use("/tasks", tasksRouter);
