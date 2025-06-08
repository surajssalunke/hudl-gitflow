import cors from "cors";
import express from "express";
import morgan from "morgan";
import routes from "./routes";
import MCPClient from "./services/mcp";
import BedrockClient from "./services/bedrock";

const app = express();

const mcpClient = new MCPClient();
mcpClient
  .connectToServer()
  .then(() => {
    app.locals.mcpClient = mcpClient;
  })
  .catch((error) => {
    mcpClient.cleanup();
    console.error("Failed to connect to MCP server:", error);
    process.exit(1);
  });
const bedrockClient = new BedrockClient();
app.locals.bedrockClient = bedrockClient;

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", routes);

export default app;
