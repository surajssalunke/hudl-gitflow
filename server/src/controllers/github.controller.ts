import { Response } from "express";
import { SquadRequest } from "../middleware/resolveSquad";
import { getCycleTimeForSquadRepos, getOctokit } from "../helpers/github";
import Anthropic from "@anthropic-ai/sdk";
import { anthropicConfig } from "../config/github";

const client = new Anthropic({
  apiKey: anthropicConfig.apiKey,
});

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

      // const params: Anthropic.MessageCreateParams = {
      //   max_tokens: 1024,
      //   messages: [{ role: "user", content: aiPrompt }],
      //   model: anthropicConfig.model,
      // };
      // aiInsights = await client.messages.create(params);

      // if (
      //   aiInsights &&
      //   aiInsights.content &&
      //   aiInsights.content.length > 0 &&
      //   aiInsights.content[0].type === "text"
      // ) {
      //   const text = aiInsights.content[0].text;
      //   // Match any array of strings, not just those in ```json blocks
      //   const arrayBlocks = [
      //     ...text.matchAll(/\[\s*("[^"]+"(?:\s*,\s*"[^"]+")*)\s*\]/g),
      //   ];

      //   const prCycleTimeInsights = arrayBlocks[0]
      //     ? [...arrayBlocks[0][1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      //     : [];
      //   const prCountAndCommitsInsights = arrayBlocks[1]
      //     ? [...arrayBlocks[1][1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      //     : [];

      aiInsights = {
        prCycleTimeInsights: [
          "Many PRs (4 out of 7) lack any review activity, suggesting a potential gap in the code review process and possibly indicating insufficient collaboration practices",
          "The average time between PR creation and merge for completed PRs is relatively short (around 30-45 minutes), which could indicate either very efficient reviews or possibly rushed reviews that might miss important issues",
          "Most PRs contain single commits and are created immediately after the commit, showing a pattern of small, atomic changes which is generally good practice",
        ],
        prCountAndCommitsInsights: [
          "Activity is concentrated in two main repositories with similar PR counts (hudl-gitflow: 4, tmp-fargo: 3), suggesting balanced work distribution across projects",
          "Commit activity shows a clear pattern of low volume (1-2 commits per day) but consistent daily contributions, which might indicate either small incremental changes or potential under-utilization of version control",
          "There's a noticeable gap in activity between May 30 and June 3, which could indicate sprint boundaries or potential workflow interruptions that might need investigation",
        ],
        raw: 'Let me analyze the data and provide insights:\n\nFirst, analyzing prCycleTimeEntries:\n```json\n[\n  "Many PRs (4 out of 7) lack any review activity, suggesting a potential gap in the code review process and possibly indicating insufficient collaboration practices",\n  "The average time between PR creation and merge for completed PRs is relatively short (around 30-45 minutes), which could indicate either very efficient reviews or possibly rushed reviews that might miss important issues",\n  "Most PRs contain single commits and are created immediately after the commit, showing a pattern of small, atomic changes which is generally good practice"\n]\n```\n\nAnalyzing prCountPerRepo and commitsPerDay together:\n```json\n[\n  "Activity is concentrated in two main repositories with similar PR counts (hudl-gitflow: 4, tmp-fargo: 3), suggesting balanced work distribution across projects",\n  "Commit activity shows a clear pattern of low volume (1-2 commits per day) but consistent daily contributions, which might indicate either small incremental changes or potential under-utilization of version control",\n  "There\'s a noticeable gap in activity between May 30 and June 3, which could indicate sprint boundaries or potential workflow interruptions that might need investigation"\n]\n```',
      } as any;
      // }
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
