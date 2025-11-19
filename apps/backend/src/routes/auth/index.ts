import express from "express";
import { router as signinRouter } from "./signin";
import { router as registerRouter } from "./register";
import { router as signoutRouter } from "./signout";

export const router = express.Router();

router.use("/signin", signinRouter);
router.use("/register", registerRouter);
router.use("/signout", signoutRouter);
