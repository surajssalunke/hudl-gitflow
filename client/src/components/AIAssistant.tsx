import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "./ui/sidebar";
import axios from "axios";
import MarkdownPreview from "@uiw/react-markdown-preview";

let SERVER_HOST_URL = "http://localhost:8080";
if (import.meta.env.PROD) {
  SERVER_HOST_URL = "";
}

const createAssistantPrompt = (
  userQuery: string,
  repoName: string,
  memberName: string
) => {
  return `${userQuery}. 
  The username is ${memberName} and the repo is ${repoName}.
  Format your response in clear, structured Markdown with bullet points, tables, and summaries where helpful. 
  Don't keep any unnecessary empty lines and spaces in response and remove your tool call information.
`;
};

export default function AIAssistant() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "You", text: input }]);
    setLoading(true);
    const userQuery = input;
    setInput("");
    try {
      const res = await axios.post(
        `${SERVER_HOST_URL}/api/assistant/ask`,
        {
          query: createAssistantPrompt(
            userQuery,
            selectedRepo!,
            selectedMember!
          ),
        },
        {
          headers: {
            "x-github-username": localStorage.getItem("github_username") || "",
          },
        }
      );
      setMessages((prev) => [
        ...prev,
        { sender: "Assistant", text: res.data.result },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "Assistant", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const hasMessages = messages.length > 0;
  const isSendDisabled = !selectedMember || !selectedRepo || loading;

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-row"
      style={{ height: "100vh" }}
    >
      <Sidebar
        activePage="assistant"
        selectedMember={selectedMember}
        selectedRepo={selectedRepo}
        setSelectedMember={setSelectedMember}
        setSelectedRepo={setSelectedRepo}
      />
      <main className="fixed top-[62px] h-[calc(100vh-62px)] flex-1 flex flex-col bg-white rounded-r-xl shadow-md min-h-0 w-full">
        <div
          className={`flex-1 flex flex-col items-center px-4 pb-0 pt-4 overflow-y-auto ${
            hasMessages ? "justify-end" : ""
          }`}
        >
          {!hasMessages && isSendDisabled && (
            <div className="w-full max-w-2xl mb-4 text-center text-base text-red-600 font-semibold bg-red-50 border border-red-200 rounded p-2">
              Please select both a member and a repo from the sidebar to start
              chatting.
            </div>
          )}
          {hasMessages && (
            <div
              className="w-full max-w-4xl flex-1 flex flex-col gap-2 mb-4 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,0,0,0.08) rgba(0,0,0,0)",
                minHeight: 0,
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`self-${
                    msg.sender === "You" ? "end" : "start"
                  } bg-gray-100 rounded-lg px-4 py-2 text-base text-gray-800 shadow-sm whitespace-pre-wrap`}
                >
                  <span className="font-semibold mr-2">{msg.sender}:</span>
                  {msg.sender === "Assistant" ? (
                    <MarkdownPreview
                      className="bg-gray-100 p-2"
                      wrapperElement={{
                        "data-color-mode": "light",
                      }}
                      source={msg.text}
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
            </div>
          )}
          <div
            className={`w-full max-w-4xl ${
              hasMessages ? "mb-2" : "flex flex-col flex-1 justify-center"
            }`}
            style={
              !hasMessages
                ? {
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                  }
                : {}
            }
          >
            {!hasMessages && !isSendDisabled && (
              <div className="w-full max-w-4xl mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded text-gray-700 text-sm px-4 py-3 mb-2 text-center">
                  Ask the AI to analyze PRs, reviews, or member activity. Try
                  prompts like:
                  <span className="block mt-1 text-gray-500 italic">
                    "How effective are the code reviews?" &bull; "Summarize
                    commit quality for this repo" &bull; "Show rework patterns
                    for this member"
                  </span>
                </div>
              </div>
            )}
            <div className="p-4 border-t flex items-center gap-2 bg-white rounded-b-xl">
              <Input
                placeholder="analyze pull requests, code reviews, and more..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  !isSendDisabled && e.key === "Enter" && handleSend()
                }
                className="rounded-xl text-lg px-4 py-2"
                disabled={isSendDisabled}
              />
              <Button
                onClick={handleSend}
                className="rounded-xl px-6 py-2 text-lg"
                disabled={isSendDisabled}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
