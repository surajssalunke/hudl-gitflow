import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Navbar({
  activeTab,
  setActiveTab,
  onLogout,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}) {
  const isUserLoggedIn = !!localStorage.getItem("github_username");

  return (
    <div className="flex items-center justify-between p-3 border-b rounded-t-xl bg-white/80 sticky top-0 z-30 backdrop-blur shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">GitFlow</span>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-2">
          <TabsList>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {isUserLoggedIn ? (
        <div className="flex items-center space-x-3">
          {localStorage.getItem("github_avatar") ? (
            <img
              src={localStorage.getItem("github_avatar")!}
              alt="avatar"
              className="w-8 h-8 rounded-full border object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-base border">
              {localStorage.getItem("github_username")?.[0]?.toUpperCase() ||
                "U"}
            </div>
          )}
          <Button
            variant="outline"
            onClick={onLogout}
            className="text-sm font-medium"
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/login")}
          className="text-sm font-medium"
        >
          Login
        </Button>
      )}
    </div>
  );
}
