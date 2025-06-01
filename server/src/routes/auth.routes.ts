import express from "express";
import {
  loginWithGitHub,
  githubCallback,
} from "../controllers/auth.controller";

const router = express.Router();

router.get("/github", loginWithGitHub);
router.get("/github/callback", githubCallback);

export default router;
