import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

import BedrockClient from "../services/bedrock";

async function main() {
  const bedrockClient = new BedrockClient();
  try {
    await bedrockClient.chatLoop();
  } catch (error) {
    console.error("Error invoking model:", error);
  }
}

main();
