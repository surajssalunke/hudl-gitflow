import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { awsConfig, env } from "../config";
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

const accessKeyId = awsConfig.accessKeyId;
const secretAccessKey = awsConfig.secretAccessKey;
const sessionToken = awsConfig.sessionToken;
if (env !== "development") {
  if (!accessKeyId) {
    throw new Error("AWS_ACCESS_KEY_ID is not set");
  }
  if (!secretAccessKey) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not set");
  }
  if (!sessionToken) {
    throw new Error("AWS_SESSION_TOKEN is not set");
  }
}

export default class BedrockClient {
  private client: BedrockRuntimeClient;
  private region = AWS_REGION;
  private modelId = AWS_BEDROCK_MODEL_ID;
  private credentialsProfile = AWS_CREDENTIALS_PROFILE;

  constructor() {
    if (env === "development") {
      this.client = new BedrockRuntimeClient({
        region: this.region,
        credentials: fromIni({
          profile: this.credentialsProfile,
        }),
      });
    } else {
      this.client = new BedrockRuntimeClient({
        region: this.region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          sessionToken: process.env.AWS_SESSION_TOKEN,
        },
      });
    }
  }

  async converse(prompt: string) {
    const command = new ConverseCommand({
      modelId: this.modelId,
      messages: [
        {
          role: "user",
          content: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });
    try {
      const response = await this.client.send(command);
      const parsedResponse =
        response.output?.message?.content
          ?.map((content) => content.text)
          .join("\n") || "No response content";
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
        const response = await this.converse(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }
}
