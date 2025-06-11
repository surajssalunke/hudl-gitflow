import os
from mcp import StdioServerParameters

print("Loading configuration...", os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN"))

github_server_params = StdioServerParameters(
    command="/Users/suraj.salunke/.rd/bin/docker",
    args=[
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server",
    ],
    env={
        "GITHUB_PERSONAL_ACCESS_TOKEN": os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN"),
    },
)
