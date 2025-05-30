# hudl-gh

A CLI tool that connects to the GitHub MCP server and Anthropic Claude to process queries and interact with GitHub using AI-powered tools.

## Prerequisites

- [Node.js](https://nodejs.org/en/download) (latest LTS version recommended)
- A valid Anthropic API key
- A valid GitHub Personal Access Token

## Setup

1. **Clone this repository:**

   ```sh
   git clone <repo-url>
   cd hudl-gh
   ```

2. **Create a `.env` file:**

   - Copy `.env.example` to `.env` (if `.env.example` exists), or create a new `.env` file.
   - Add your `ANTHROPIC_API_KEY` and `GITHUB_PERSONAL_ACCESS_TOKEN` to the `.env` file.

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Build and start the application:**
   ```sh
   npm start
   ```

## Usage

- After starting, type your queries at the prompt.
- Type `quit` to exit the application.

## Project Structure

- `index.ts`: Main entry point for the CLI application.
- `build/`: Compiled JavaScript output.
- `package.json`: Project configuration and dependencies.

## License

ISC
