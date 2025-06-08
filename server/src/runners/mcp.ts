import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

import MCPClient from "../services/mcp";

async function main() {
  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer();
    await mcpClient.chatLoop();
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
  }
}

main();
