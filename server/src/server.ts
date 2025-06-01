import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
