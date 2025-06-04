import { SimpleBarChart } from "./chart/simpleBar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type TProps = {
  commitsPerDay: Record<string, number>;
  prCountPerRepo: Record<string, number>;
  prCountAndCommitsInsights: Array<string>;
};

function SimpleBarAIInsights({ aiInsights }: { aiInsights: string[] }) {
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
      <h3 className="text-base font-semibold mb-2 text-green-900">
        AI Insights
      </h3>
      <ul className="list-disc pl-5 text-green-800 text-sm space-y-1">
        {aiInsights && aiInsights.length > 0 ? (
          aiInsights.map((insight, index) => <li key={index}>{insight}</li>)
        ) : (
          <li>No AI insights available</li>
        )}
      </ul>
    </div>
  );
}

export default function PRCommmitActivity({
  commitsPerDay,
  prCountPerRepo,
  prCountAndCommitsInsights,
}: TProps) {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-base">PR & Commit Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <SimpleBarChart
              data={commitsPerDay}
              title="Commits Throughput"
              xAxisLabel="number of commits"
            />
          </div>
          <div>
            <SimpleBarChart
              data={prCountPerRepo}
              title="PR Throughput By Repo"
              xAxisLabel="number of pr's"
            />
          </div>
          <div>
            <SimpleBarAIInsights aiInsights={prCountAndCommitsInsights} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
