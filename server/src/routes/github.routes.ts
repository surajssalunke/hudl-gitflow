import express from "express";
import { getPrCycleTimes } from "../controllers/github.controller";
import { resolveSquad } from "../middleware/resolveSquad";

const router = express.Router();

router.post("/squad", resolveSquad, getPrCycleTimes);

export default router;
