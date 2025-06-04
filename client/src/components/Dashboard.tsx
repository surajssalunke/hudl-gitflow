import axios from "axios";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { PRCycleTime } from "@/types/insights";
import { CycleTimeMetrics } from "@/components/PRCycleTimeMetrics";
import { Input } from "@/components/ui/input";
import PRCommmitActivity from "./PRCommmitActivity";
import Sidebar from "./ui/sidebar";

type SquadInsightsResponse = {
  prCycleTimeEntries: PRCycleTime[];
  commitsPerDay: Record<string, number>;
  prCountPerRepo: Record<string, number>;
  aiInsights: {
    prCycleTimeInsights: Array<string>;
    prCountAndCommitsInsights: Array<string>;
    raw: string;
  };
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
    const fetchInsights = async () => {
      try {
        const payload = {
          from: from || "2025-05-25",
          to: to || undefined,
        };
        const res = await axios.post(
          "http://localhost:8080/api/insights/squad/pr-cycle-and-throughput",
          payload,
          {
            headers: {
              "x-github-username":
                localStorage.getItem("github_username") || "",
            },
          }
        );
        setData(res.data);
      } catch {
        setData(null);
      }
    };
    fetchInsights();
  }, [from, to]);

  const handleDownloadJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `squad-insights-${from}-to-${to}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-2 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
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
            <Button variant="outline" onClick={handleDownloadJSON}>
              Download JSON
            </Button>
          </div>
        </div>
        <CycleTimeMetrics
          prs={data.prCycleTimeEntries}
          aiInsights={data.aiInsights.prCycleTimeInsights}
        />
        <PRCommmitActivity
          commitsPerDay={data.commitsPerDay}
          prCountPerRepo={data.prCountPerRepo}
          prCountAndCommitsInsights={data.aiInsights.prCountAndCommitsInsights}
        />
      </main>
    </div>
  );
}
