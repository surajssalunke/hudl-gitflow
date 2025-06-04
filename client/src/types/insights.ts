export interface InsightsResponse {
  squad: string;
  period: {
    from: string;
    to: string;
  };
  avgMergeTimeHours: number;
  totalPRs: number;
  totalCommits: number;
  squadPRsByDay: Record<string, number>;
  squadCommitsByDay: Record<string, number>;
  repoBreakdown: RepoBreakdown[];
  commitsPerUser: Record<string, number>;
}

export interface PRCycleTime {
  prNumber: number;
  repo: string;
  title: string;
  url: string;
  firstCommitAt: string;
  createdAt: string;
  firstReviewAt: string;
  lastCommitAt: string;
  mergedAt: string | null;
  closedAt: string | null;
}

export interface RepoBreakdown {
  repo: string;
  prMergeTimes: number[];
  prCount: number;
  commitCount: number;
  prMergesByDay: Record<string, number>;
  commitsByDay: Record<string, number>;
  commitsPerUser: Record<string, number>;
}
