import type { PRCycleTime } from "@/types/squadInsights";

export function computeClosePRStats(
  prs: PRCycleTime[],
  startKey: "createdAt" | "firstCommitAt" | "firstReviewAt" | "lastCommitAt",
  endKey: "closedAt" | "mergedAt"
) {
  const durations = prs
    .map((pr) => {
      const start = pr[startKey];
      const end = pr[endKey];
      if (!start || !end) return null;
      return new Date(end).getTime() - new Date(start).getTime();
    })
    .filter((d): d is number => d !== null)
    .sort((a, b) => a - b);

  if (durations.length === 0) return { avg: "N/A", p50: "N/A", p90: "N/A" };

  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p90 = durations[Math.floor(durations.length * 0.9)];

  const toDays = (ms: number): number =>
    +(ms / (1000 * 60 * 60 * 24)).toFixed(2);
  return { avg: toDays(avg), p50: toDays(p50), p90: toDays(p90) };
}

export function computeOpenPRStats(
  prs: PRCycleTime[],
  startKey: keyof PRCycleTime
) {
  const durations = prs
    .map((pr) => {
      const start = pr[startKey];
      if (!start) return null;
      return new Date().getTime() - new Date(start).getTime();
    })
    .filter((d): d is number => d !== null)
    .sort((a, b) => a - b);

  if (durations.length === 0) return { avg: "N/A", p50: "N/A", p90: "N/A" };

  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p90 = durations[Math.floor(durations.length * 0.9)];

  const toDays = (ms: number): number =>
    +(ms / (1000 * 60 * 60 * 24)).toFixed(2);
  return { avg: toDays(avg), p50: toDays(p50), p90: toDays(p90) };
}

export const getAvgDays = (prs: PRCycleTime[]) => {
  const durations = prs.map((pr) => {
    const start = new Date(pr.firstCommitAt || pr.createdAt);
    const end = new Date(
      pr.closedAt || pr.mergedAt || new Date().toISOString()
    );
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  });
  return durations.length
    ? Number(
        +(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)
      )
    : 0;
};
