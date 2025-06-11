import { Request, Response } from "express";
import axios from "axios";

export async function ask(req: Request, res: Response) {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res
        .status(400)
        .json({ error: "Missing or invalid 'query' in request body" });
      return;
    }
    const apiResponse = await axios.post("http://localhost:8000/invoke", {
      prompt: query,
    });
    const response = apiResponse.data?.response;
    res.json({ result: response });
    return;
  } catch (error) {
    console.error("Error in askAssistant controller:", error);
    res.status(500).json({ error: "Failed to process query" });
    return;
  }
}
