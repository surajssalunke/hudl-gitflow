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
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
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
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-gray-600 text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row">
      <Sidebar
        selectedMember={selectedMember}
        selectedRepo={selectedRepo}
        setSelectedMember={setSelectedMember}
        setSelectedRepo={setSelectedRepo}
      />
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
              className="border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 focus:ring-red-200"
              onClick={() => {
                setFrom("");
                setTo("");
              }}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-600 focus:ring-blue-200"
              onClick={handleDownloadJSON}
            >
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
