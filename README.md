# hudl-gh

A web dashboard and agent interface for GitHub squad insights, powered by Anthropic Claude and shadcn/ui. Visualize PR/commit metrics, cycle times, and AI-generated insights for your squad, with a modern, responsive UI.

---

## Features

- **Squad Insights Dashboard**: View PR/commit metrics, cycle time tables, and AI-generated insights for your squad or repos.
- **AI Agent Interface**: Chat-like interface for AI-powered actions and queries, with sidebar actions and context.
- **Date Filtering**: Filter all metrics and insights by date range.
- **Modern UI**: Built with React, TypeScript, and shadcn/ui for a beautiful, consistent experience.
- **Backend**: Node/Express server fetches GitHub data, generates insights with Anthropic Claude, and returns structured results.

---

## Prerequisites

- [Node.js](https://nodejs.org/en/download) (latest LTS recommended)
- [pnpm](https://pnpm.io/) or npm
- Anthropic API key
- GitHub Personal Access Token

---

## Setup

1. **Clone this repository:**
   ```sh
   git clone <repo-url>
   cd hudl-gh
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` in the `server/` directory, or create a new `.env` file.
   - Add your `ANTHROPIC_API_KEY` and `GITHUB_PERSONAL_ACCESS_TOKEN`.
3. **Install dependencies:**
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```
4. **Start the application:**
   - In one terminal, start the backend:
     ```sh
     cd server && npm run dev
     ```
   - In another terminal, start the frontend:
     ```sh
     cd client && npm run dev
     ```
   - The dashboard will be available at [http://localhost:5173](http://localhost:5173)

---

## Usage

- Log in with your GitHub account.
- Use the dashboard to explore squad metrics, PR cycle times, and AI insights.
- Switch to the AI Agent tab for chat-based actions and queries.

---

## Project Structure

- `client/` — React frontend (TypeScript, shadcn/ui)
  - `src/components/` — UI components, charts, dashboard, agent
  - `src/pages/` — Main app pages
  - `src/types/` — TypeScript types
  - `src/util/` — Utility functions
- `server/` — Node/Express backend
  - `src/controllers/` — API controllers (GitHub, AI)
  - `src/helpers/` — GitHub and AI helpers
  - `src/config/` — Configuration files
  - `src/routes/` — Express routes

---

## License

ISC
