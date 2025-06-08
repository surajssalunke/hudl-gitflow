import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { awsConfig } from "../config";
import readline from "readline/promises";

const AWS_REGION = awsConfig.region;
if (!AWS_REGION) {
  throw new Error("AWS_REGION is not set");
}
const AWS_BEDROCK_MODEL_ID = awsConfig.bedrockModelId;
if (!AWS_BEDROCK_MODEL_ID) {
  throw new Error("AWS_BEDROCK_MODEL_ID is not set");
}
const AWS_CREDENTIALS_PROFILE = awsConfig.credentialsProfile;
if (!AWS_CREDENTIALS_PROFILE) {
  throw new Error("AWS_CREDENTIALS_PROFILE is not set");
}

export default class BedrockClient {
  private client: BedrockRuntimeClient;
  private region = AWS_REGION;
  private modelId = AWS_BEDROCK_MODEL_ID;
  private credentialsProfile = AWS_CREDENTIALS_PROFILE;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: this.region,
      credentials: fromIni({ profile: this.credentialsProfile }),
    });
  }

  async invokeModel(prompt: string, maxTokens: number = 1024) {
    const command = new InvokeModelCommand({
      modelId: this.modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: maxTokens,
      }),
    });
    try {
      const response = await this.client.send(command);
      const responseBody = Buffer.from(response.body).toString("utf8");
      const parsedResponse = JSON.parse(responseBody);
      return parsedResponse;
    } catch (error) {
      console.error("Error invoking model:", error);
      throw error;
    }
  }

  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      console.log("\nBedrock Client Started!");
      console.log("Type your queries or 'quit' to exit.");

      while (true) {
        const message = await rl.question("\nQuery: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.invokeModel(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }
}
