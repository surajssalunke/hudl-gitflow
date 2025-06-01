import axios from "axios";
import { Request, Response } from "express";
import { githubConfig } from "../config/github";

const { clientId, clientSecret, callbackUrl } = githubConfig;

/**
 * Step 1: Redirect user to GitHub for authentication
 */
export const loginWithGitHub = (_: Request, res: Response) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=read:org,repo`;
  res.redirect(redirectUrl);
};

/**
 * Step 2: GitHub redirects back with `code`. We exchange it for an access token.
 */
export const githubCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).send("Authorization code is missing");
    return;
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      res.status(401).json({ error: "Failed to retrieve access token" });
      return;
    }

    // Fetch authenticated user info
    const userRes = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const user = userRes.data;

    // You can also store the accessToken in a DB/session/etc
    // For now, just return it with basic user info
    res.json({
      username: user.login,
      avatar_url: user.avatar_url,
      name: user.name,
      token: accessToken, // Don't send this to frontend in real apps without precautions
    });
  } catch (err: any) {
    console.error("GitHub auth failed:", err.response?.data || err.message);
    res.status(500).json({ error: "GitHub authentication failed" });
  }
};
