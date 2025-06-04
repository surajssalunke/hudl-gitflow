import { Response } from "express";
// import axios from "axios";
// import { githubConfig } from "../config/github";
import { SquadRequest } from "../middleware/resolveSquad";
import { getCycleTimeForSquadRepos, getOctokit } from "../helpers/github";

interface Squad {
  repos: string[];
  members: string[];
}
interface SquadsConfig {
  [squadName: string]: Squad;
}

// function getDateRange(period?: string) {
//   const now = new Date();
//   let from: Date;
//   if (period === "month") {
//     from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//   } else if (period === "week") {
//     from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//   } else {
//     from = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
//   }
//   return { from: from.toISOString(), to: now.toISOString() };
// }

// export const getSquadInsights = async (req: SquadRequest, res: Response) => {
//   const { period } = req.body as {
//     period?: string;
//   };

//   if (!req.squad) {
//     res.status(404).json({ error: "User not found in any squad" });
//     return;
//   }

//   const { from, to } = getDateRange(period);

//   const githubToken = githubConfig.githubToken;
//   if (!githubToken) {
//     res.status(500).json({ error: "GitHub token not configured" });
//     return;
//   }

//   async function fetchRepoInsights(repo: string): Promise<{
//     repo: string;
//     prMergeTimes: number[];
//     prCount: number;
//     commitCount: number;
//     prMergesByDay: { [date: string]: number };
//     commitsByDay: { [date: string]: number };
//     commitsPerUser: { [username: string]: number };
//   }> {
//     // Fetch PRs merged in period
//     const prsRes = await axios.get(
//       `https://api.github.com/repos/surajssalunke/${repo}/pulls`,
//       {
//         headers: { Authorization: `Bearer ${githubToken}` },
//         params: {
//           state: "closed",
//           per_page: 100,
//           sort: "updated",
//           direction: "desc",
//         },
//       }
//     );

//     const prs = (prsRes.data as any[]).filter(
//       (pr) =>
//         pr.merged_at &&
//         pr.merged_at >= from &&
//         pr.merged_at <= to &&
//         req.members!.includes(pr.user.login)
//     );
//     // Calculate merge times
//     const prMergeTimes = prs.map((pr) => {
//       const created = new Date(pr.created_at).getTime();
//       const merged = new Date(pr.merged_at).getTime();
//       return (merged - created) / (1000 * 60 * 60); // hours
//     });
//     // Group PR merges by day
//     const prMergesByDay = groupByDay(
//       prs.map((pr) => ({ date: pr.merged_at })),
//       from,
//       to
//     );

//     // Fetch commits in period
//     const commitsRes = await axios.get(
//       `https://api.github.com/repos/surajssalunke/${repo}/commits`,
//       {
//         headers: { Authorization: `Bearer ${githubToken}` },
//         params: {
//           since: from,
//           until: to,
//           per_page: 100,
//         },
//       }
//     );
//     const commits = (commitsRes.data as any[]).filter(
//       (c) =>
//         (c.commit &&
//           c.commit.author &&
//           req.members!.includes(c.commit.author.name)) ||
//         (c.author && req.members!.includes(c.author.login))
//     );
//     // Group commits by day
//     const commitsByDay = groupByDay(
//       commits.map((c) => ({ date: c.commit.author.date })),
//       from,
//       to
//     );
//     // Group commits by user
//     const commitsPerUser: { [username: string]: number } = {};
//     commits.forEach((c) => {
//       let username =
//         c.author && c.author.login
//           ? c.author.login
//           : c.commit && c.commit.author && c.commit.author.name
//           ? c.commit.author.name
//           : undefined;
//       if (username && req.members!.includes(username)) {
//         commitsPerUser[username] = (commitsPerUser[username] || 0) + 1;
//       }
//     });

//     return {
//       repo,
//       prMergeTimes,
//       prCount: prs.length,
//       commitCount: commits.length,
//       prMergesByDay,
//       commitsByDay,
//       commitsPerUser,
//     };
//   }

//   // Helper to group data by day
//   function groupByDay(items: { date: string }[], from: string, to: string) {
//     const result: { [date: string]: number } = {};
//     const start = new Date(from);
//     const end = new Date(to);
//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const key = d.toISOString().slice(0, 10);
//       result[key] = 0;
//     }
//     items.forEach((item) => {
//       const key = item.date.slice(0, 10);
//       if (result[key] !== undefined) result[key]++;
//     });
//     return result;
//   }

//   try {
//     const insights = await Promise.all(req.repos!.map(fetchRepoInsights));
//     // Aggregate
//     const allMergeTimes: number[] = insights.flatMap((i) => i.prMergeTimes);
//     const avgMergeTime =
//       allMergeTimes.length > 0
//         ? allMergeTimes.reduce((a, b) => a + b, 0) / allMergeTimes.length
//         : null;
//     const totalPRs = insights.reduce((sum, i) => sum + i.prCount, 0);
//     const totalCommits = insights.reduce((sum, i) => sum + i.commitCount, 0);

//     // Squad-level time series
//     const squadPRsByDay: { [date: string]: number } = {};
//     const squadCommitsByDay: { [date: string]: number } = {};
//     if (insights.length > 0) {
//       const days = Object.keys(insights[0].prMergesByDay);
//       days.forEach((day) => {
//         squadPRsByDay[day] = insights.reduce(
//           (sum, i) => sum + (i.prMergesByDay[day] || 0),
//           0
//         );
//         squadCommitsByDay[day] = insights.reduce(
//           (sum, i) => sum + (i.commitsByDay[day] || 0),
//           0
//         );
//       });
//     }

//     res.status(200).json({
//       squad: req.squad,
//       period: { from, to },
//       avgMergeTimeHours: avgMergeTime,
//       totalPRs,
//       totalCommits,
//       squadPRsByDay,
//       squadCommitsByDay,
//       repoBreakdown: insights,
//       // Aggregate commits per user across all repos
//       commitsPerUser: insights.reduce((acc, repo) => {
//         Object.entries(repo.commitsPerUser).forEach(([user, count]) => {
//           acc[user] = (acc[user] || 0) + count;
//         });
//         return acc;
//       }, {} as { [username: string]: number }),
//     });
//     return;
//   } catch (err: any) {
//     console.error("Error fetching squad insights:", err.message);
//     res.status(500).json({ error: "Failed to fetch squad insights" });
//   }
// };

export async function getPrCycleTimes(req: SquadRequest, res: Response) {
  const { from, to } = req.body as {
    from?: string;
    to?: string;
  };

  if (!req.squad || !from || !to) {
    res.status(400).json({ error: "Missing params: squad, from, to" });
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

    res.json(data);
    return;
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
    return;
  }
}
