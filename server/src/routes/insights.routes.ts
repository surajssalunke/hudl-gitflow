import express from "express";
import { getSquadInsights } from "../controllers/insights.controller";

const router = express.Router();

router.get("/squad", getSquadInsights);

export default router;
