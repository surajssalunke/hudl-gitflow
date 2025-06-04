import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { differenceInHours } from "date-fns";
import type { PRCycleTime } from "@/types/insights";

interface TProps {
  data: PRCycleTime[];
  type: "count" | "hours";
  title: string;
}

export const PRMetricsChartCard: React.FC<TProps> = ({ data, type, title }) => {
  const openPRs = data.filter((pr) => !pr.closedAt && !pr.mergedAt);
  const mergedPRs = data.filter((pr) => pr.mergedAt);
  const closedPRs = data.filter((pr) => pr.closedAt && !pr.mergedAt);

  let chartData: { name: string; value: number }[] = [];

  if (type === "count") {
    chartData = [
      { name: "Open", value: openPRs.length },
      { name: "Merged", value: mergedPRs.length },
      { name: "Closed", value: closedPRs.length },
    ];
  } else if (type === "hours") {
    const getAvgHours = (prs: PRCycleTime[]) => {
      const durations = prs.map((pr) => {
        const start = new Date(pr.firstCommitAt || pr.createdAt);
        const end = new Date(
          pr.closedAt || pr.mergedAt || new Date().toISOString()
        );
        return differenceInHours(end, start);
      });
      return durations.length
        ? +(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)
        : 0;
    };

    chartData = [
      { name: "Open", value: getAvgHours(openPRs) },
      { name: "Merged", value: getAvgHours(mergedPRs) },
      { name: "Closed", value: getAvgHours(closedPRs) },
    ];
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: type === "count" ? "PR Count" : "Avg Duration (hrs)",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { textAnchor: "middle", fontSize: 12 },
              }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
