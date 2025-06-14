import axios from "axios";
import { useEffect, useState } from "react";

type TProps = {
  activePage?: "dashboard" | "assistant";
  selectedMember: string | null;
  selectedRepo: string | null;
  setSelectedMember: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedRepo: React.Dispatch<React.SetStateAction<string | null>>;
};

let SERVER_HOST_URL = "http://localhost:8080";
if (import.meta.env.PROD) {
  SERVER_HOST_URL = "";
}

export default function Sidebar({
  activePage = "dashboard",
  selectedMember,
  selectedRepo,
  setSelectedMember,
  setSelectedRepo,
}: TProps) {
  const [squadInfo, setSquadInfo] = useState<{
    squad: string;
    members: string[];
    repos: string[];
  } | null>(null);

  useEffect(() => {
    const fetchSquadInfo = async () => {
      try {
        const res = await axios.get(`${SERVER_HOST_URL}/api/insights/squad`, {
          headers: {
            "x-github-username": localStorage.getItem("github_username") || "",
          },
        });
        if (res.data.squad && res.data.members && res.data.repos) {
          setSquadInfo({
            squad: res.data.squad,
            members: res.data.members,
            repos: res.data.repos,
          });
        }
      } catch {
        setSquadInfo(null);
      }
    };
    fetchSquadInfo();
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-[220px] min-w-[180px] max-w-[260px] bg-white/90 border-r shadow-sm p-4 sticky top-[62px] h-[calc(100vh-62px)] z-20">
      <h2 className="text-lg font-bold mb-4 text-blue-800">
        {squadInfo?.squad || "Squad"}
      </h2>
      <div className="my-2">
        <div className="h-px bg-gray-200 w-full" />
      </div>
      <div className="flex flex-col h-full gap-2">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Members
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            {squadInfo?.members?.map((m) => (
              <li
                key={m}
                className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 transition-colors ${
                  selectedMember === m
                    ? "bg-blue-100 text-blue-800 font-bold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedMember(m)}
              >
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px bg-gray-200 w-full" />
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Repos
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            {squadInfo?.repos?.map((r) => (
              <li
                key={r}
                className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 transition-colors ${
                  selectedRepo === r
                    ? "bg-blue-100 text-blue-800 font-bold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedRepo(r)}
              >
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px bg-gray-200 w-full" />
        {activePage === "assistant" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Workflows
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                Pull Request Forecasts
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                Deployment Forecasts
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                Draft a PR
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                Submit a Review For PR
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
