import express from "express";
import { getMCQs } from "../services/ollamaScorer.js";

const router = express.Router();

router.post("/score-answer", async (req, res) => {
  try {
    const { topic, level, numQuestions } = req.body;

    if (!topic || !level || !numQuestions) {
      return res.status(400).json({
        error: "topic, level, and numQuestions are required",
      });
    }

    const result = await getMCQs({
      topic,
      level,
      numQuestions,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch MCQs",
      details: err.message,
    });
  }
});

export default router;
