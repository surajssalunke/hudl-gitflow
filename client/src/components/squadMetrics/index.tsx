import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import PRCommmitActivity from "./pRCommitActivity";
import CycleTimeMetrics from "./pRCycleTimeMetrics";
import ReviewMetrics from "./reviewMetricsPerRepoCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getData, getDateRange, setData } from "@/store/dashboardSlice";
import { transformDateRangeToISO } from "@/util/transformations";

let SERVER_HOST_URL = "http://localhost:8080";
if (import.meta.env.PROD) {
  SERVER_HOST_URL = "";
}

export default function SquadMetrics() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const data = useAppSelector(getData);
  const rawDateRange = useAppSelector(getDateRange);

  useEffect(() => {
    const dateRange = transformDateRangeToISO(rawDateRange);
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const payload = {
          from: dateRange.start,
          to: dateRange.end,
        };
        const res = await axios.post(
          `${SERVER_HOST_URL}/api/insights/squad/pr-cycle-and-throughput`,
          payload,
          {
            headers: {
              "x-github-username":
                localStorage.getItem("github_username") || "",
            },
          }
        );
        dispatch(setData(res.data));
      } catch (e) {
        if (e instanceof AxiosError && e.response?.data.error) {
          setError(e.response.data.error);
        }
        dispatch(setData(null));
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [rawDateRange, dispatch]);

  if (loading) {
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

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <span className="text-gray-600 text-lg font-medium">
          {error ? error : "No data available for the selected date range."}
        </span>
      </div>
    );
  }

  return (
    <>
      <CycleTimeMetrics
        prs={data.prCycleTimeEntries}
        aiInsights={data.aiInsights?.prCycleTimeInsights}
      />
      <PRCommmitActivity
        commitsPerDay={data.commitsPerDay}
        prCountPerRepo={data.prCountPerRepo}
        prCountAndCommitsInsights={data.aiInsights?.prCountAndCommitsInsights}
      />
      <ReviewMetrics reviewMetricsPerRepo={data.reviewMetricsPerRepo} />
    </>
  );
}
