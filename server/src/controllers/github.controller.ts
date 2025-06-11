import { Response } from "express";
import { SquadRequest } from "../middleware/resolveSquad";
import { getCycleTimeForSquadRepos, getOctokit } from "../helpers/github";

export async function getSquad(req: SquadRequest, res: Response) {
  res
    .status(200)
    .json({ squad: req.squad, members: req.members, repos: req.repos });
  return;
}

export async function getPrCycleTimesAndThroughput(
  req: SquadRequest,
  res: Response
) {
  const { from, to } = req.body as {
    from?: string;
    to?: string;
  };

  if (!req.squad || !from) {
    res.status(400).json({ error: "Missing params: squad, from" });
    return;
  }

  try {
    if (!req.repos || !req.repos.length) {
      res.status(404).json({ error: "No repos found for squad" });
      return;
    }

    const octokit = getOctokit();

    const data = await getCycleTimeForSquadRepos(
      octokit,
      req.owner!,
      req.members!,
      req.repos,
      from as string,
      to as string
    );

    let aiInsights: any = null;
    try {
      const aiPrompt = `You are an expert engineering manager and scrum master. Analyze the following PR cycle time data and provide 2-3 actionable insights for the team. Analyze prCycleTimeEntries first and then provide insights based on the data. Focus on identifying patterns, bottlenecks, and areas for improvement. Provide your insights in a JSON array of strings format. Then analyze prCountPerRepo and commitsPerDay together and provide 2-3 additional insights based on the overall activity and trends in the data.
      \n\nData: ${JSON.stringify(data).slice(0, 4000)}\n\nInsights:`;

      const modelResponse = await req.app.locals.bedrockClient.converse(
        aiPrompt
      );

      if (modelResponse) {
        const arrayBlocks = [
          ...modelResponse.matchAll(/\[\s*("[^"]+"(?:\s*,\s*"[^"]+")*)\s*\]/g),
        ];

        const prCycleTimeInsights = arrayBlocks[0]
          ? [...arrayBlocks[0][1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
          : [];
        const prCountAndCommitsInsights = arrayBlocks[1]
          ? [...arrayBlocks[1][1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
          : [];

        aiInsights = {
          prCycleTimeInsights,
          prCountAndCommitsInsights,
          raw: modelResponse,
        };
      }
    } catch (aiErr) {
      console.error("AI Insights error:", aiErr);
      aiInsights = null;
    }

    res.json({ ...data, aiInsights });
    return;
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
    return;
  }
}
