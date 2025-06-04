import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarItems = [
  { label: "Ask For Insights" },
  { label: "Create PR" },
  { label: "Review PR" },
];

export default function Agent() {
  const [activeSidebar, setActiveSidebar] = useState("Ask For Insights");
  const [input, setInput] = useState("");
  const [, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "You", text: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen h-screen bg-gray-50 p-6">
      <div className="flex h-full" style={{ height: "calc(90vh - 24px)" }}>
        {/* Sidebar */}
        <div className="w-56 border-r flex flex-col pt-6 bg-white rounded-l-xl shadow-md h-full">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`text-left px-6 py-2 font-bold text-lg hover:bg-gray-200 ${
                activeSidebar === item.label ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveSidebar(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white rounded-r-xl shadow-md h-full">
          <div className="flex-1 flex items-center justify-center">
            {activeSidebar === "Ask For Insights" && <></>}
            {activeSidebar === "Create PR" && (
              <span className="text-2xl text-gray-400 font-semibold">
                Coming soon...
              </span>
            )}
            {activeSidebar === "Review PR" && (
              <span className="text-2xl text-gray-400 font-semibold">
                Coming soon...
              </span>
            )}
          </div>
          {/* Bottom input only for Ask For Insights */}
          {activeSidebar === "Ask For Insights" && (
            <div className="p-4 border-t flex items-center gap-2">
              <Input
                placeholder="ask anything your repo related"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="rounded-xl text-lg px-4 py-2"
              />
              <Button
                onClick={handleSend}
                className="rounded-xl px-6 py-2 text-lg"
              >
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
