import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import app from "./app";

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
