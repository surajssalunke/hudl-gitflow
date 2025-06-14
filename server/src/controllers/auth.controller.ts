import axios from "axios";
import { Request, Response } from "express";

import { env, githubConfig } from "../config";

const { clientId, clientSecret, callbackUrl } = githubConfig;

let CLIENT_HOST_URL = "http://localhost:5173";
if (env !== "development") {
  CLIENT_HOST_URL = "";
}

export const loginWithGitHub = (_: Request, res: Response) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=read:org,repo`;
  res.redirect(redirectUrl);
};

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

    const userRes = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const user = userRes.data;
    res.redirect(
      `${CLIENT_HOST_URL}/login?username=${
        user.login
      }&avatar_url=${encodeURIComponent(
        user.avatar_url
      )}&name=${encodeURIComponent(user.name)}`
    );
  } catch (err: any) {
    console.error("GitHub auth failed:", err.response?.data || err.message);
    res.status(500).json({ error: "GitHub authentication failed" });
  }
};
