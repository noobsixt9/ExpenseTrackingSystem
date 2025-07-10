import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import accountRoute from "./accountRoute.js";
import transactionRoute from "./transactionRoute.js";
import geminiRoute from "./geminiRoute.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/account", accountRoute);
router.use("/transaction", transactionRoute);
router.use("/gemini", geminiRoute);

export default router;
