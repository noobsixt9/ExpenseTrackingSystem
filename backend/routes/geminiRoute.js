import express from "express";
import { userAuth } from "../middleware/authMiddleware.js";
import { getFinancialFeedback } from "../controllers/geminiController.js";

const router = express.Router();

router.get("/financial-feedback", userAuth, getFinancialFeedback);

export default router;
