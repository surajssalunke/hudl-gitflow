import { Navbar } from "@/components/ui/navbar";
import Dashboard from "../components/Dashboard";
import AIAssistant from "../components/AIAssistant";
import { useAppSelector } from "@/store/hooks";
import { getActivePage } from "@/store/dashboardSlice";

export default function Main() {
  const activePage = useAppSelector(getActivePage);

  const onLogoutHandler = () => {
    localStorage.removeItem("github_username");
    localStorage.removeItem("github_name");
    localStorage.removeItem("github_avatar");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-5">
      <Navbar onLogout={onLogoutHandler} />
      {activePage === "insights" ? <Dashboard /> : <AIAssistant />}
    </div>
  );
}
