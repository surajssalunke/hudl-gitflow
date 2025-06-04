import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#6366f1", "#3b82f6", "#10b981"];

export function RepoPRBreakdownChart({
  data,
}: {
  data: { repo: string; prCount: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="prCount" nameKey="repo" outerRadius={80}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RepoCommitBreakdownChart({
  data,
}: {
  data: { repo: string; commitCount: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="repo" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="commitCount" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}
