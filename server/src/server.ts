import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import app from "./app";
import { serverPort } from "./config";

app.listen(serverPort, () => {
  console.log(`Server running on http://localhost:${serverPort}`);
});
