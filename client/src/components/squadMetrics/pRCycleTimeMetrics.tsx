import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PRCycleTime } from "@/types/squadInsights";
import {
  computeClosePRStats,
  computeOpenPRStats,
  getAvgDays,
} from "@/util/duration";
import { PRMetricsChartCard } from "../chart/prMetricsChart";

type PRStatsMetric = {
  label: string;
  avg: number | string;
  p50: number | string;
  p90: number | string;
};

function formatDays(days: number | string) {
  return typeof days === "string" ? days : `${days.toFixed(2)} days`;
}

function CycleTimeTable({
  prs,
  prType,
}: {
  prs: PRCycleTime[];
  prType: "open" | "closed" | "merged";
}) {
  let metrics: Array<PRStatsMetric> = [];
  let tableHeader = "";

  if (prType === "open") {
    tableHeader = "Aging metrics for open PR's";
    const openPRs = prs.filter((pr) => !pr.mergedAt && !pr.closedAt);

    metrics = [
      {
        label: "First Commit → Still Open",
        ...computeOpenPRStats(openPRs, "firstCommitAt"),
      },
      {
        label: "PR Created → Still Open",
        ...computeOpenPRStats(openPRs, "createdAt"),
      },
      {
        label: "First Review → Still Open",
        ...computeOpenPRStats(
          openPRs.filter((pr) => pr.firstReviewAt),
          "firstReviewAt"
        ),
      },
      {
        label: "Last Commit → Still Open",
        ...computeOpenPRStats(openPRs, "lastCommitAt"),
      },
    ];
  } else if (prType === "closed") {
    tableHeader = "Cycle time metrics for closed PR's";
    const closedPrs = prs.filter((pr) => pr.closedAt);

    metrics = [
      {
        label: "First Commit → Closed",
        ...computeClosePRStats(closedPrs, "firstCommitAt", "closedAt"),
      },
      {
        label: "PR Created → Closed",
        ...computeClosePRStats(closedPrs, "createdAt", "closedAt"),
      },
      {
        label: "First Review → Closed",
        ...computeClosePRStats(
          closedPrs.filter((pr) => pr.firstReviewAt),
          "firstReviewAt",
          "closedAt"
        ),
      },
      {
        label: "Last Commit → Closed",
        ...computeClosePRStats(closedPrs, "lastCommitAt", "closedAt"),
      },
    ];
  } else {
    tableHeader = "Cycle time metrics for merged PR's";
    const mergedPrs = prs.filter((pr) => pr.mergedAt);

    metrics = [
      {
        label: "First Commit → Merged",
        ...computeClosePRStats(mergedPrs, "firstCommitAt", "closedAt"),
      },
      {
        label: "PR Created → Merged",
        ...computeClosePRStats(mergedPrs, "createdAt", "closedAt"),
      },
      {
        label: "First Review → Merged",
        ...computeClosePRStats(
          mergedPrs.filter((pr) => pr.firstReviewAt),
          "firstReviewAt",
          "closedAt"
        ),
      },
      {
        label: "Last Commit → Merged",
        ...computeClosePRStats(mergedPrs, "lastCommitAt", "closedAt"),
      },
    ];
  }

  return (
    <div className="overflow-x-auto mb-6">
      <div className="font-semibold text-gray-700 mb-2 text-base">
        {tableHeader}
      </div>
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 font-semibold text-left">Metric</th>
            <th className="px-4 py-2 font-semibold text-right">Avg</th>
            <th className="px-4 py-2 font-semibold text-right">P50</th>
            <th className="px-4 py-2 font-semibold text-right">P90</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2 text-left align-middle">{m.label}</td>
              <td className="px-4 py-2 text-right align-middle">
                {formatDays(m.avg)}
              </td>
              <td className="px-4 py-2 text-right align-middle">
                {formatDays(m.p50)}
              </td>
              <td className="px-4 py-2 text-right align-middle">
                {formatDays(m.p90)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AIInsights({ aiInsights }: { aiInsights: string[] }) {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
      <h3 className="text-base font-semibold mb-2 text-blue-900">
        AI Insights
      </h3>
      <ul className="list-disc pl-5 text-blue-800 text-sm space-y-1">
        {aiInsights && aiInsights.length > 0 ? (
          aiInsights.map((insight, index) => <li key={index}>{insight}</li>)
        ) : (
          <li>No AI insights available</li>
        )}
      </ul>
    </div>
  );
}

export default function CycleTimeMetrics({
  prs,
  aiInsights,
}: {
  prs: PRCycleTime[];
  aiInsights: string[];
}) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col h-full">
                <CycleTimeTable prs={prs} prType="open" />
                <CycleTimeTable prs={prs} prType="closed" />
                <CycleTimeTable prs={prs} prType="merged" />
                <AIInsights aiInsights={aiInsights} />
              </div>
              <div className="flex flex-col h-full gap-2 justify-stretch">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card className="flex flex-col items-center justify-center py-4 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400 shadow-md">
                    <div className="text-xs font-semibold text-blue-700 mb-1 tracking-wide uppercase">
                      Open PRs
                    </div>
                    <div className="text-2xl font-extrabold text-blue-900 drop-shadow-sm">
                      {prs.filter((pr) => !pr.closedAt && !pr.mergedAt).length}
                    </div>
                  </Card>
                  <Card className="flex flex-col items-center justify-center py-4 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400 shadow-md">
                    <div className="text-xs font-semibold text-blue-700 mb-1 tracking-wide uppercase">
                      Avg Time Open
                    </div>
                    <div className="text-2xl font-extrabold text-blue-900 drop-shadow-sm">
                      {getAvgDays(
                        prs.filter((pr) => !pr.closedAt && !pr.mergedAt)
                      ) || "N/A"}{" "}
                      days
                    </div>
                  </Card>
                </div>
                <div className="flex-1 flex flex-col justify-stretch">
                  <PRMetricsChartCard
                    data={prs}
                    type="hours"
                    title="Throughput By Status"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-stretch">
                  <PRMetricsChartCard
                    data={prs}
                    type="count"
                    title="Cycle Time From PR Creation By Status"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {repos.map((repo) => (
            <TabsContent key={repo} value={repo}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col h-full">
                  <CycleTimeTable
                    prs={prs.filter((pr) => pr.repo === repo)}
                    prType="open"
                  />
                  <CycleTimeTable
                    prs={prs.filter((pr) => pr.repo === repo)}
                    prType="closed"
                  />
                  <CycleTimeTable
                    prs={prs.filter((pr) => pr.repo === repo)}
                    prType="merged"
                  />
                  <AIInsights aiInsights={aiInsights} />
                </div>
                <div className="flex flex-col h-full gap-2 justify-stretch">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Card className="flex flex-col items-center justify-center py-4 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400 shadow-md">
                      <div className="text-xs font-semibold text-blue-700 mb-1 tracking-wide uppercase">
                        Open PRs
                      </div>
                      <div className="text-2xl font-extrabold text-blue-900 drop-shadow-sm">
                        {
                          prs.filter(
                            (pr) =>
                              pr.repo === repo && !pr.closedAt && !pr.mergedAt
                          ).length
                        }
                      </div>
                    </Card>
                    <Card className="flex flex-col items-center justify-center py-4 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400 shadow-md">
                      <div className="text-xs font-semibold text-blue-700 mb-1 tracking-wide uppercase">
                        Avg Time Open
                      </div>
                      <div className="text-2xl font-extrabold text-blue-900 drop-shadow-sm">
                        {getAvgDays(
                          prs.filter(
                            (pr) =>
                              pr.repo === repo && !pr.closedAt && !pr.mergedAt
                          )
                        ) || "N/A"}{" "}
                        days
                      </div>
                    </Card>
                  </div>
                  <div className="flex-1 flex flex-col justify-stretch">
                    <PRMetricsChartCard
                      data={prs.filter((pr) => pr.repo === repo)}
                      type="hours"
                      title="Throughput By Status"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-stretch">
                    <PRMetricsChartCard
                      data={prs.filter((pr) => pr.repo === repo)}
                      type="count"
                      title="Cycle Time From PR Creation By Status"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
