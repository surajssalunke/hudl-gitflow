import express from "express";
import {
  getPrCycleTimesAndThroughput,
  getSquad,
} from "../controllers/github.controller";
import { resolveSquad } from "../middleware/resolveSquad";

const router = express.Router();

router.get("/squad", resolveSquad, getSquad);
router.post(
  "/squad/pr-cycle-and-throughput",
  resolveSquad,
  getPrCycleTimesAndThroughput
);

export default router;
