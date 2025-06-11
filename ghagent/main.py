from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = Path("/Users/suraj.salunke/Coderepos/hudl-gh/.env")
load_dotenv(dotenv_path=dotenv_path)

from config import github_server_params
from InlineAgent.tools import MCPStdio
from InlineAgent.action_group import ActionGroup
from InlineAgent.agent import InlineAgent


class BedrockGithubAgent:
    def __init__(self, aws_profile, agent_name, foundation_model, mcp_clients):
        self.inline_agent = InlineAgent(
            profile=aws_profile,
            agent_name=agent_name,
            foundation_model=foundation_model,
            instruction="""You are a friendly assistant that is responsible for resolving user queries.
                            You have access to github tools.
                        """,
            action_groups=[
                ActionGroup(
                    name="GithubActionGroup",
                    mcp_clients=mcp_clients,
                ),
            ],
        )


async def main():
    github_mcp_client = await MCPStdio.create(
        server_params=github_server_params, max_parameters=10
    )

    try:
        agent = BedrockGithubAgent(
            aws_profile=os.getenv("AWS_CREDENTIALS_PROFILE"),
            foundation_model=os.getenv("AWS_BEDROCK_MODEL_ID"),
            agent_name="github-mcp-agent",
            mcp_clients=[github_mcp_client],
        )
        agent_answer = await agent.inline_agent.invoke(
            input_text="hello, would you analyze last pr for me? the username is surajssalunke and the repo is hudl-gitflow",
        )

        print("Agent Answer:", agent_answer)
    finally:
        await github_mcp_client.cleanup()


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
