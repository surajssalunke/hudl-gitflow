import express from "express";
import authRoutes from "./auth.routes";
import githubRoutes from "./github.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/insights", githubRoutes);

export default router;
