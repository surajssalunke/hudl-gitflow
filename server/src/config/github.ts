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
