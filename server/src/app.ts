import cors from "cors";
import express from "express";
import morgan from "morgan";
import routes from "./routes";

const app = express();

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
