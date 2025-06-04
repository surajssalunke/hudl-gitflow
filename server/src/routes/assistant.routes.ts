import express from "express";
import { ask } from "../controllers/askAssistant.controller";
import { resolveSquad } from "../middleware/resolveSquad";

const router = express.Router();

router.post("/ask", resolveSquad, ask);

export default router;
