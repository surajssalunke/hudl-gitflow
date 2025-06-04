import axios from "axios";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [squadInfo, setSquadInfo] = useState<{
    squad: string;
    members: string[];
    repos: string[];
  } | null>(null);

  useEffect(() => {
    const fetchSquadInfo = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/insights/squad/",
          {
            headers: {
              "x-github-username":
                localStorage.getItem("github_username") || "",
            },
          }
        );
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
    <aside className="hidden md:flex flex-col w-1/6 min-w-[180px] max-w-xs bg-white/90 border-r shadow-sm p-5 sticky top-[56px] h-[calc(100vh-56px)] z-20">
      <h2 className="text-lg font-bold mb-4 text-blue-800">
        {squadInfo?.squad || "Squad"}
      </h2>
      <div className="my-2">
        <div className="h-px bg-gray-200 w-full" />
      </div>
      <div className="flex flex-col h-full">
        <div className="flex-1 mb-4 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Members
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            {squadInfo?.members?.map((m) => (
              <li key={m} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="my-2">
          <div className="h-px bg-gray-200 w-full" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Repos
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            {squadInfo?.repos?.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
