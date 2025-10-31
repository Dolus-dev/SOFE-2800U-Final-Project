import express from "express";
import { middlewareExample } from "./example";

export const router = express.Router();

router.use(middlewareExample);
