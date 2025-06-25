import type { ChangeEvent } from "react";
import { Button } from "./button";
import { Input } from "./input";
import {
  getData,
  getDateRange,
  getMember,
  setDateRange,
} from "@/store/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function TopBar() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(getData);
  const dateRange = useAppSelector(getDateRange);
  const member = useAppSelector(getMember);

  function onStartDateChange(e: ChangeEvent<HTMLInputElement>): void {
    dispatch(
      setDateRange({ start: new Date(e.target.value), end: dateRange.end })
    );
  }

  function onToDateChange(e: ChangeEvent<HTMLInputElement>): void {
    dispatch(
      setDateRange({ start: dateRange.start, end: new Date(e.target.value) })
    );
  }

  function setDefaultDateRange() {
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    dispatch(setDateRange({ start: twoWeeksAgo, end: today }));
  }

  const handleDownloadJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `squad-insights-${dateRange.start
      .toISOString()
      .slice(0, 10)}-to-${dateRange.end.toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
      <h2 className="text-xl font-semibold">
        {member ? "Squad" : "Member"} Insights
      </h2>
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">From:</label>
        <Input
          type="date"
          value={dateRange.start.toISOString().slice(0, 10)}
          onChange={onStartDateChange}
          max={dateRange.end.toISOString().slice(0, 10)}
          className="w-36"
        />
        <label className="text-sm font-medium text-gray-700">To:</label>
        <Input
          type="date"
          value={dateRange.end.toISOString().slice(0, 10)}
          onChange={onToDateChange}
          min={dateRange.start.toISOString().slice(0, 10) || undefined}
          className="w-36"
        />
        <Button
          variant="outline"
          className="border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 focus:ring-red-200"
          onClick={setDefaultDateRange}
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
  );
}
