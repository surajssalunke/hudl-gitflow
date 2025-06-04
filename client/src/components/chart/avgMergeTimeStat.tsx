import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AvgMergeTimeStat({ hours }: { hours: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avg Merge Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{hours.toFixed(2)} hrs</div>
      </CardContent>
    </Card>
  );
}
