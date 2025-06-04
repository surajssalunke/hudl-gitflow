import type { PRCycleTime } from "@/types/insights";

export function computeClosePRStats(
  prs: PRCycleTime[],
  startKey: keyof PRCycleTime,
  endKeyFn: (pr: PRCycleTime) => keyof PRCycleTime
) {
  const durations = prs
    .map((pr) => {
      const start = pr[startKey];
      const endKey: keyof PRCycleTime = endKeyFn(pr);
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

  const toHrs = (ms: number): number => +(ms / (1000 * 60 * 60)).toFixed(2);
  return { avg: toHrs(avg), p50: toHrs(p50), p90: toHrs(p90) };
}

export function computeCloseStats(prs: PRCycleTime[]) {
  const durations = prs
    .map((pr) => {
      const start = pr["createdAt"];
      if (!start) return null;
      return new Date().getTime() - new Date(start).getTime();
    })
    .filter((d): d is number => d !== null)
    .sort((a, b) => a - b);

  if (durations.length === 0) return { avg: "N/A", p50: "N/A", p90: "N/A" };

  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p90 = durations[Math.floor(durations.length * 0.9)];

  const toHrs = (ms: number): number => +(ms / (1000 * 60 * 60)).toFixed(2);
  return { avg: toHrs(avg), p50: toHrs(p50), p90: toHrs(p90) };
}
