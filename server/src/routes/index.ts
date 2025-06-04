import express from "express";
import authRoutes from "./auth.routes";
import githubRoutes from "./github.routes";
import assistantRoutes from "./assistant.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/insights", githubRoutes);
router.use("/assistant", assistantRoutes);

export default router;
