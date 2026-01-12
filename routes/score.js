import express from "express";
import { scoreAnswer } from "../services/ollamaScorer.js";

const router = express.Router();

router.post("/score-answer", async (req, res) => {
  try {
    const { question, modelAnswer, studentAnswer, maxMarks = 10 } = req.body;

    if (!question || !modelAnswer || !studentAnswer) {
      return res.status(400).json({
        error: "question, modelAnswer, and studentAnswer are required",
      });
    }

    const result = await scoreAnswer({
      question,
      modelAnswer,
      studentAnswer,
      maxMarks,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Evaluation failed",
      details: err.message,
    });
  }
});

export default router;
