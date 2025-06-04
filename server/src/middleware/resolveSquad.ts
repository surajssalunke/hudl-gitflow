import { NextFunction, Response } from "express";
import { Request as ExpressRequest } from "express";

import squads from "../config/squads";

export interface SquadRequest extends ExpressRequest {
  owner?: string;
  squad?: string;
  members?: string[];
  repos?: string[];
}

export const resolveSquad = (
  req: SquadRequest,
  res: Response,
  next: NextFunction
) => {
  const { githubUsername } = req.body;

  if (!githubUsername || typeof githubUsername !== "string") {
    res.status(400).json({ error: "githubUsername is required" });
    return;
  }

  for (const [squad, data] of Object.entries(squads)) {
    if (data.members.includes(githubUsername)) {
      req.owner = githubUsername;
      req.squad = squad;
      req.members = data.members || [];
      req.repos = data.repos || [];
      return next();
    }
  }

  res.status(404).json({ error: "User not found in any squad" });
};
