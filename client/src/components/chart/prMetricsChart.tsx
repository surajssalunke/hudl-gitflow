import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { PRCycleTime } from "@/types/insights";
import { getAvgDays } from "@/util/duration";

interface TProps {
  data: PRCycleTime[];
  type: "count" | "hours";
  title: string;
}

export const PRMetricsChartCard: React.FC<TProps> = ({ data, type, title }) => {
  const mergedPRs = data.filter((pr) => pr.mergedAt);
  const closedPRs = data.filter((pr) => pr.closedAt && !pr.mergedAt);

  let chartData: { name: string; value: number }[] = [];

  if (type === "count") {
    chartData = [
      { name: "Merged", value: mergedPRs.length },
      { name: "Closed", value: closedPRs.length },
    ];
  } else if (type === "hours") {
    chartData = [
      { name: "Merged", value: getAvgDays(mergedPRs) },
      { name: "Closed", value: getAvgDays(closedPRs) },
    ];
  }

  return (
    <div>
      <div className="font-semibold text-gray-700 mb-2 text-base">{title}</div>
      <Card className="w-full">
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: type === "count" ? "PR Count" : "Avg Duration (days)",
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
    </div>
  );
};
