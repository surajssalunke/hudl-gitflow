from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pydantic import BaseModel
import os
from InlineAgent.tools import MCPStdio

from main import BedrockGithubAgent
from config import github_server_params

dotenv_path = Path("/Users/suraj.salunke/Coderepos/hudl-gh/.env")
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str


github_mcp_client = None
agent = None


async def initialize_agent():
    global github_mcp_client, agent
    github_mcp_client = await MCPStdio.create(
        server_params=github_server_params, max_parameters=10
    )
    agent = BedrockGithubAgent(
        aws_profile=os.getenv("AWS_CREDENTIALS_PROFILE"),
        foundation_model=os.getenv("AWS_BEDROCK_MODEL_ID"),
        agent_name="github-mcp-agent",
        mcp_clients=[github_mcp_client],
    )


@app.on_event("startup")
async def startup_event():
    await initialize_agent()


@app.on_event("shutdown")
async def shutdown_event():
    await github_mcp_client.cleanup()


@app.post("/invoke")
async def invoke_agent(request: PromptRequest):
    if not agent:
        raise HTTPException(status_code=500, detail="Agent not initialized")
    agent_answer = await agent.inline_agent.invoke(input_text=request.prompt)
    return {"response": agent_answer}
