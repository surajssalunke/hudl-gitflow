import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReviewMetrics {
  averageReviewCount: number;
  averageTimeToFirstReview: number;
  reviewCompletionRate: number;
  prsWithReworkCount: number;
}

interface ReviewMetricsPerRepoCardProps {
  reviewMetricsPerRepo: Record<string, ReviewMetrics>;
}

const metricsConfig = [
  {
    key: "averageReviewCount",
    label: "Avg Review Count",
    color: "#6366f1",
    format: (v: number) => v.toFixed(2),
  },
  {
    key: "averageTimeToFirstReview",
    label: "Avg Time to 1st Review (hrs)",
    color: "#3b82f6",
    format: (v: number) => v.toFixed(2),
  },
  {
    key: "reviewCompletionRate",
    label: "Review Completion Rate (%)",
    color: "#10b981",
    format: (v: number) => v.toFixed(0) + "%",
  },
  {
    key: "prsWithReworkCount",
    label: "PRs With Rework",
    color: "#f59e0b",
    format: (v: number) => v.toString(),
  },
];

export default function ReviewMetricsPerRepoCard({
  reviewMetricsPerRepo,
}: ReviewMetricsPerRepoCardProps) {
  if (!reviewMetricsPerRepo || Object.keys(reviewMetricsPerRepo).length === 0) {
    return null;
  }

  // Prepare data for each metric as a bar chart per repo
  const repos = Object.keys(reviewMetricsPerRepo);
  const chartData = repos.map((repo) => ({
    repo,
    ...reviewMetricsPerRepo[repo],
  }));

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-base">Review Metrics Per Repo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {metricsConfig.map((metric) => (
            <div>
              <div className="font-semibold text-gray-700 mb-2 text-base">
                {metric.label}
              </div>
              <Card key={metric.key} className="mb-4">
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="repo" />
                      <YAxis />
                      <Tooltip formatter={metric.format} />
                      <Bar
                        dataKey={metric.key}
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
