export const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackUrl: process.env.GITHUB_CALLBACK_URL!,
  scopes: ["read:org", "repo"],
  apiBaseUrl: "https://api.github.com",
  githubToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
};

export const anthropicConfig = {
  apiKey: process.env.ANTHROPIC_API_KEY!,
  model: "claude-3-5-sonnet-latest",
};

export const awsConfig = {
  region: process.env.AWS_REGION!,
  credentialsProfile: process.env.AWS_CREDENTIALS_PROFILE!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  bedrockModelId: process.env.AWS_BEDROCK_MODEL_ID!,
};

export const env = process.env.ENV || "development";
export const serverPort = process.env.SERVER_PORT || 8080;
export const agentPort = process.env.AGENT_PORT || 8081;
