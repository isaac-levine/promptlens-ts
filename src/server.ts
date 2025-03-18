import "dotenv/config";
import express from "express";
import { POST, GET } from "./api/metrics";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Metrics endpoints
app.post("/metrics", POST);
app.get("/metrics", GET);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
