import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import routes from "./routes";
import BedrockClient from "./services/bedrock";
import { env } from "./config";

const app = express();

const bedrockClient = new BedrockClient();
app.locals.bedrockClient = bedrockClient;

app.use(express.json());
app.use(morgan("dev"));

if (env === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use("/api", routes);

if (env !== "development") {
  app.use(express.static(path.resolve(__dirname, "../../client")));
  app.use("", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/index.html"));
  });
}

export default app;
