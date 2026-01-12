import express from "express";
import scoreRouter from "./routes/score.js";

const app = express();
app.use(express.json());

const HOST = "0.0.0.0";
const PORT = 3100;

/* Health check */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* Routes */
app.use("/api", scoreRouter);

/* Start server */
app.listen(PORT, HOST, () => {
  console.log(`✅ Exam Scoring API running on ${HOST}:${PORT}`);
});
