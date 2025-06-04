import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import Dashboard from "../components/Dashboard";
import AIAssistant from "../components/AIAssistant";

export default function Main() {
  const [activeTab, setActiveTab] = useState("insights");

  const onLogoutHandler = () => {
    localStorage.removeItem("github_username");
    localStorage.removeItem("github_name");
    localStorage.removeItem("github_avatar");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-5">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogoutHandler}
      />
      {activeTab === "insights" ? <Dashboard /> : <AIAssistant />}
    </div>
  );
}
