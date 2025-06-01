import express from "express";
import authRoutes from "./auth.routes";
import insightsRoutes from "./insights.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/insights", insightsRoutes);

export default router;
