import { Request, Response } from "express";

export async function ask(req: Request, res: Response) {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res
        .status(400)
        .json({ error: "Missing or invalid 'query' in request body" });
      return;
    }
    const mcpClient = req.app.locals.mcpClient;
    if (!mcpClient) {
      res.status(500).json({ error: "MCP client not initialized" });
      return;
    }
    const result = await mcpClient.processQuery(query);
    res.json({ result });
    return;
  } catch (error) {
    console.error("Error in askAssistant controller:", error);
    res.status(500).json({ error: "Failed to process query" });
    return;
  }
}
