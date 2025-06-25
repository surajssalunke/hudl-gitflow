import Sidebar from "./ui/sidebar";
import SquadMetrics from "./squadMetrics";
import IndividualMetrics from "./individualMetrics";
import TopBar from "./ui/topbar";
import { useAppSelector } from "@/store/hooks";
import { getMember } from "@/store/dashboardSlice";

export default function Dashboard() {
  const member = useAppSelector(getMember);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-2 p-6">
        <TopBar />
        {!member ? <SquadMetrics /> : <IndividualMetrics />}
      </main>
    </div>
  );
}
