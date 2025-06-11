import cors from "cors";
import express from "express";
import morgan from "morgan";
import routes from "./routes";
import BedrockClient from "./services/bedrock";

const app = express();

const bedrockClient = new BedrockClient();
app.locals.bedrockClient = bedrockClient;

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", routes);

export default app;
