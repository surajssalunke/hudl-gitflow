import { Octokit } from "octokit";
import { githubConfig } from "../config";

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
): Promise<{
  prCycleTimeEntries: PRCycleTimeEntry[];
  commitsPerDay: Record<string, number>;
  prCountPerRepo: Record<string, number>;
  reviewMetricsPerRepo: Record<
    string,
    {
      averageReviewCount: number;
      averageTimeToFirstReview: number; // in hours
      reviewCompletionRate: number; // percentage
      prsWithReworkCount: number;
    }
  >;
}> {
  const prCycleTimeEntries: PRCycleTimeEntry[] = [];
  const commitsPerDayMap = new Map<string, number>();
  const prCountPerRepoMap = new Map<string, number>();
  const reviewMetricsPerRepoMap = new Map<
    string,
    {
      totalReviewCount: number;
      totalTimeToFirstReview: number;
      prsWithReviews: number;
      prsWithCompletedReviews: number;
      prsWithReworkCount: number;
      prCount: number;
    }
  >();

  for (const repo of repos) {
    const allPRs = await octokit.paginate(octokit.rest.pulls.list, {
      owner,
      repo,
      state: "all",
      sort: "updated",
      direction: "desc",
      per_page: 100,
    });

    const filteredPRs = allPRs.filter(
      (pr) =>
        members.includes(pr.user.login) &&
        new Date(pr.created_at) >= new Date(since) &&
        new Date(pr.created_at) <= (until ? new Date(until) : new Date())
    );

    prCountPerRepoMap.set(repo, filteredPRs.length);

    reviewMetricsPerRepoMap.set(repo, {
      totalReviewCount: 0,
      totalTimeToFirstReview: 0,
      prsWithReviews: 0,
      prsWithCompletedReviews: 0,
      prsWithReworkCount: 0,
      prCount: filteredPRs.length,
    });

    for (const pr of filteredPRs) {
      const [comparison, reviews] = await Promise.all([
        octokit.rest.repos.compareCommits({
          owner,
          repo,
          base: pr.base.sha,
          head: pr.head.sha,
        }),
        octokit.rest.pulls.listReviews({ owner, repo, pull_number: pr.number }),
      ]);

      const prCommits = comparison.data.commits;

      for (const commit of prCommits) {
        const authorLogin = commit.author?.login;
        if (!authorLogin || !members.includes(authorLogin)) continue;

        const commitDate = new Date(
          commit.commit.committer?.date ??
            commit.commit.author?.date ??
            pr.created_at
        )
          .toISOString()
          .slice(0, 10);

        commitsPerDayMap.set(
          commitDate,
          (commitsPerDayMap.get(commitDate) ?? 0) + 1
        );
      }

      const firstCommitAt =
        prCommits[0]?.commit?.committer?.date ?? pr.created_at;
      const lastCommitAt =
        prCommits[prCommits.length - 1]?.commit?.committer?.date ??
        pr.created_at;

      const firstReview = reviews.data.find((r) => r.submitted_at);
      const firstReviewAt = firstReview?.submitted_at ?? null;

      prCycleTimeEntries.push({
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

      const repoMetrics = reviewMetricsPerRepoMap.get(repo)!;
      const reviewCount = reviews.data.length;
      repoMetrics.totalReviewCount += reviewCount;

      if (firstReviewAt) {
        repoMetrics.totalTimeToFirstReview +=
          (new Date(firstReviewAt).getTime() -
            new Date(pr.created_at).getTime()) /
          36e5;
        repoMetrics.prsWithReviews++;
      }

      if (
        reviews.data.every(
          (r) => r.state === "APPROVED" || r.state === "CHANGES_REQUESTED"
        )
      ) {
        repoMetrics.prsWithCompletedReviews++;
      }

      const reviewStartTime = firstReview?.submitted_at ?? pr.created_at;
      const reworkCommits = prCommits.filter(
        (c) =>
          new Date(
            c.commit.committer?.date ?? c.commit.author?.date ?? pr.created_at
          ) > new Date(reviewStartTime)
      );
      if (reworkCommits.length > 0) repoMetrics.prsWithReworkCount++;
    }
  }

  const reviewMetricsPerRepo: Record<
    string,
    {
      averageReviewCount: number;
      averageTimeToFirstReview: number;
      reviewCompletionRate: number;
      prsWithReworkCount: number;
    }
  > = {};

  for (const [repo, m] of reviewMetricsPerRepoMap.entries()) {
    reviewMetricsPerRepo[repo] = {
      averageReviewCount: m.prCount > 0 ? m.totalReviewCount / m.prCount : 0,
      averageTimeToFirstReview:
        m.prsWithReviews > 0 ? m.totalTimeToFirstReview / m.prsWithReviews : 0,
      reviewCompletionRate:
        m.prCount > 0 ? (m.prsWithCompletedReviews / m.prCount) * 100 : 0,
      prsWithReworkCount: m.prsWithReworkCount,
    };
  }

  return {
    prCycleTimeEntries,
    commitsPerDay: Object.fromEntries(commitsPerDayMap),
    prCountPerRepo: Object.fromEntries(prCountPerRepoMap),
    reviewMetricsPerRepo,
  };
}
