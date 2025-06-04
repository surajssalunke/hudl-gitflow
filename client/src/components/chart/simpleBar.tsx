import { Card, CardContent } from "@/components/ui/card";
import { transformObjectToChartData } from "@/util/transformations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

interface Props {
  data: Record<string, number>;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  barColor?: string;
}

export function SimpleBarChart({ data, title, xAxisLabel, yAxisLabel }: Props) {
  const transformedData = transformObjectToChartData(data);
  return (
    <div>
      <div className="font-semibold text-gray-700 mb-2 text-base">{title}</div>
      <Card className="shadow-sm">
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transformedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name">
                <Label value={xAxisLabel} offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label
                  value={yAxisLabel}
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
