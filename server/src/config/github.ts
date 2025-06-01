export const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackUrl: process.env.GITHUB_CALLBACK_URL!,
  scopes: ["read:org", "repo"],
  apiBaseUrl: "https://api.github.com",
};
