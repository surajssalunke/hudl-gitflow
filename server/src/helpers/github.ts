import { Octokit } from "octokit";
import { githubConfig } from "../config/github";

export type PRCycleTimeEntry = {
  prNumber: number;
  repo: string;
  title: string;
  firstCommitAt: string | null;
  createdAt: string;
  firstReviewAt: string | null;
  lastCommitAt: string | null;
  mergedAt: string | null;
  closedAt: string | null;
  author: string;
  url: string;
};

const octokit = new Octokit({ auth: githubConfig.githubToken });

export function getOctokit() {
  return octokit;
}

export async function getCycleTimeForSquadRepos(
  octokit: Octokit,
  owner: string,
  members: string[],
  repos: string[],
  since: string,
  until: string
): Promise<PRCycleTimeEntry[]> {
  const result: PRCycleTimeEntry[] = [];

  for (const repo of repos) {
    const allPRs = await octokit.paginate(octokit.rest.pulls.list, {
      owner,
      repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: 100,
    });

    const filteredPRs = allPRs.filter(
      (pr) =>
        new Date(pr.created_at) >= new Date(since) &&
        new Date(pr.created_at) <= new Date(until)
    );

    for (const pr of filteredPRs) {
      const [commits, reviews] = await Promise.all([
        octokit.rest.pulls.listCommits({ owner, repo, pull_number: pr.number }),
        octokit.rest.pulls.listReviews({ owner, repo, pull_number: pr.number }),
      ]);

      const firstCommitAt =
        commits.data[0]?.commit?.committer?.date ?? pr.created_at;
      const lastCommitAt =
        commits.data[commits.data.length - 1]?.commit?.committer?.date ??
        pr.created_at;
      const firstReviewAt =
        reviews.data.find((r) => r.submitted_at)?.submitted_at || null;

      result.push({
        prNumber: pr.number,
        repo,
        title: pr.title,
        author: pr.user.login,
        url: pr.html_url,
        createdAt: pr.created_at,
        firstCommitAt,
        lastCommitAt,
        firstReviewAt,
        mergedAt: pr.merged_at,
        closedAt: pr.closed_at,
      });
    }
  }

  return result.filter((r) => members.includes(r.author));
}
