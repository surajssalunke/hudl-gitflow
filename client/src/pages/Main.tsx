import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import Dashboard from "../components/Dashboard";
import Agent from "../components/Agent";

export default function Main() {
  const [activeTab, setActiveTab] = useState("insights");

  const onLogoutHandler = () => {
    localStorage.removeItem("github_username");
    localStorage.removeItem("github_name");
    localStorage.removeItem("github_avatar");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-xl border border-black/30">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogoutHandler}
      />
      {activeTab === "insights" ? <Dashboard /> : <Agent />}
    </div>
  );
}
