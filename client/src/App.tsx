import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const repos = [
  "frontend-dashboard",
  "backend-graphql",
  "infra-terraform",
  "mobile-app",
  "ci-cd-pipelines",
];

export default function GithubChatUI() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "You", text: input }]);
    setInput("");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">📁 Squad Repos</h2>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {repos.map((repo) => (
              <Button
                key={repo}
                variant={selectedRepo === repo ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedRepo(repo)}
              >
                {repo}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            {selectedRepo
              ? `💬 Chat - ${selectedRepo}`
              : "Select a repo to start chatting"}
          </h2>
        </div>

        <ScrollArea className="flex-1 p-4 space-y-3">
          {messages.map((msg, i) => (
            <Card key={i} className="w-fit max-w-[75%]">
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {msg.sender}
                </p>
                <p>{msg.text}</p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>

        <Separator />

        <div className="p-4 flex gap-2 border-t">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}
