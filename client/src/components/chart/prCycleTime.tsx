import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PRCycleTime } from "@/types/insights";
import { computeClosePRStats, computeCloseStats } from "@/util/duration";
import { PRMetricsChartCard } from "./prMetricsChart";

function formatHours(hours: number | string) {
  return typeof hours === "string" ? hours : `${hours.toFixed(2)} hrs`;
}

function CycleTimeTable({ prs }: { prs: PRCycleTime[] }) {
  const mergedOrClosed = prs.filter((pr) => pr.mergedAt || pr.closedAt);
  const openPRs = prs.filter((pr) => !pr.mergedAt && !pr.closedAt);

  const endKeyFn = (pr: PRCycleTime) => {
    if (pr.mergedAt) return "mergedAt" as keyof PRCycleTime;
    else if (pr.closedAt) return "closedAt" as keyof PRCycleTime;
    return "" as keyof PRCycleTime;
  };

  const metrics = [
    {
      label: "PR Created → Merged/Closed",
      ...computeClosePRStats(mergedOrClosed, "createdAt", endKeyFn),
    },
    {
      label: "First Commit → Merged/Closed",
      ...computeClosePRStats(mergedOrClosed, "firstCommitAt", endKeyFn),
    },
    {
      label: "PR Created → First Review",
      ...computeClosePRStats(
        prs.filter((pr) => pr.firstReviewAt),
        "createdAt",
        () => "firstReviewAt" as keyof PRCycleTime
      ),
    },
    {
      label: "Last Commit → Merged/Closed",
      ...computeClosePRStats(mergedOrClosed, "lastCommitAt", endKeyFn),
    },
    {
      label: "PR Created → Still Open",
      ...computeCloseStats(openPRs),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 font-semibold">Metric</th>
            <th className="px-4 py-2 font-semibold text-center">Avg</th>
            <th className="px-4 py-2 font-semibold text-center">P50</th>
            <th className="px-4 py-2 font-semibold text-center">P90</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{m.label}</td>
              <td className="px-4 py-2 text-center">{formatHours(m.avg)}</td>
              <td className="px-4 py-2 text-center">{formatHours(m.p50)}</td>
              <td className="px-4 py-2 text-center">{formatHours(m.p90)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DummyAIInsights() {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
      <h3 className="text-base font-semibold mb-2 text-blue-900">
        AI Insights (Coming Soon)
      </h3>
      <ul className="list-disc pl-5 text-blue-800 text-sm space-y-1">
        <li>AI-powered PR review suggestions will appear here.</li>
        <li>Automated detection of bottlenecks in your PR process.</li>
        <li>Personalized recommendations to improve merge speed.</li>
        <li>Summary of code review patterns and anomalies.</li>
      </ul>
    </div>
  );
}

export function RepoInsightsTabs({ prs }: { prs: PRCycleTime[] }) {
  const repos = Array.from(new Set(prs.map((pr) => pr.repo)));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">PR Cycle Time & Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            {repos.map((repo) => (
              <TabsTrigger key={repo} value={repo}>
                {repo}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overall">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CycleTimeTable prs={prs} />
                <DummyAIInsights />
              </div>
              <div className="space-y-4">
                <PRMetricsChartCard
                  data={prs}
                  type="count"
                  title="PR Count By Status"
                />
                <PRMetricsChartCard
                  data={prs}
                  type="hours"
                  title="PR Lifetime By Status"
                />
              </div>
            </div>
          </TabsContent>

          {repos.map((repo) => (
            <TabsContent key={repo} value={repo}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CycleTimeTable prs={prs.filter((pr) => pr.repo === repo)} />
                  <DummyAIInsights />
                </div>
                <div className="space-y-4">
                  <PRMetricsChartCard
                    data={prs.filter((pr) => pr.repo === repo)}
                    type="count"
                    title="PR Count By Status"
                  />
                  <PRMetricsChartCard
                    data={prs.filter((pr) => pr.repo === repo)}
                    type="hours"
                    title="PR Lifetime By Status"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
