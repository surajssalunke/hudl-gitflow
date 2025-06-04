import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Navbar({
  activeTab,
  setActiveTab,
  onProfile,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onProfile?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border-b rounded-t-xl bg-white/80">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">GitFlow</span>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-2">
          <TabsList>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="ai-agent">AI Agent</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Button variant="outline" onClick={onProfile}>
        Profile
      </Button>
    </div>
  );
}
