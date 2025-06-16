from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = Path("../.env")
load_dotenv(dotenv_path=dotenv_path)

from InlineAgent.tools import MCPHttp
from InlineAgent.action_group import ActionGroup
from InlineAgent.agent import InlineAgent


class BedrockGithubAgent:
    def __init__(
        self,
        foundation_model,
        agent_name,
        mcp_clients,
        aws_region="us-east-1",
        aws_profile=None,
        aws_access_key_id=None,
        aws_secret_access_key=None,
        aws_session_token=None,
    ):
        self.inline_agent = InlineAgent(
            foundation_model=foundation_model,
            agent_name=agent_name,
            profile=aws_profile,
            aws_region=aws_region,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            aws_session_token=aws_session_token,
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
    github_mcp_client = None
    try:
        agent = None
        github_mcp_client = await MCPHttp.create(
            url="https://api.githubcopilot.com/mcp/",
            headers={
                "Authorization": f"Bearer {os.getenv('GITHUB_PERSONAL_ACCESS_TOKEN')}",
                "Content-Type": "application/json",
            },
            max_parameters=10,
            transport_mode="streamableHttp",
        )

        if os.getenv("ENV") == "development":
            agent = BedrockGithubAgent(
                foundation_model=os.getenv("AWS_BEDROCK_MODEL_ID"),
                agent_name="github-mcp-agent",
                mcp_clients=[github_mcp_client],
                aws_profile=os.getenv("AWS_CREDENTIALS_PROFILE"),
            )
        else:
            agent = BedrockGithubAgent(
                foundation_model=os.getenv("AWS_BEDROCK_MODEL_ID"),
                agent_name="github-mcp-agent",
                mcp_clients=[github_mcp_client],
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
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
