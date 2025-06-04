import axios from "axios";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { PRCycleTime } from "@/types/insights";
import { RepoInsightsTabs } from "@/components/chart/prCycleTime";
import { Input } from "@/components/ui/input";
import { SimpleBarChart } from "@/components/chart/simpleBar";

type SquadInsightsResponse = {
  prCycleTimeEntries: PRCycleTime[];
  commitsPerDay: Record<string, number>;
  prCountPerRepo: Record<string, number>;
};

export default function Dashboard() {
  const [data, setData] = useState<SquadInsightsResponse | null>(null);
  const [from, setFrom] = useState(() => {
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    return twoWeeksAgo.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  useEffect(() => {
    try {
      const fetchInsights = async () => {
        const payload = {
          githubUsername: localStorage.getItem("github_username") || "",
          from: from || "2025-05-25",
          to: to || undefined,
        };

        const res = await axios.post(
          "http://localhost:8080/api/insights/squad",
          payload
        );
        setData(res.data);
      };

      fetchInsights();
    } catch (error) {
      console.error(error);
    }
  }, [from, to]);

  if (!data) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Squad Insights</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">From:</label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            max={to || undefined}
            className="w-36"
          />
          <label className="text-sm font-medium text-gray-700">To:</label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min={from || undefined}
            className="w-36"
          />
          <Button
            variant="outline"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <RepoInsightsTabs prs={data.prCycleTimeEntries} />
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <SimpleBarChart
            data={data.commitsPerDay}
            title="Commits Per Day"
            xAxisLabel="number of commits"
          />
        </div>
        <div>
          <SimpleBarChart
            data={data.prCountPerRepo}
            title="PR's Per Squad Repo"
            xAxisLabel="number of pr's"
          />
        </div>
        <div>
          <SimpleBarAIInsights />
        </div>
      </div>
    </div>
  );
}

function SimpleBarAIInsights() {
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
      <h3 className="text-base font-semibold mb-2 text-green-900">
        AI Insights (Coming Soon)
      </h3>
      <ul className="list-disc pl-5 text-green-800 text-sm space-y-1">
        <li>AI will highlight unusual commit or PR activity trends here.</li>
        <li>Automated detection of peak productivity days.</li>
        <li>Repo-specific PR/commit anomalies and suggestions.</li>
        <li>Personalized insights on team contribution patterns.</li>
      </ul>
    </div>
  );
}
