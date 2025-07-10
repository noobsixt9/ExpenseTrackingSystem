import express from "express";
import {
  loginOauth,
  loginUser,
  registerOauth,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/oauth-login", loginOauth);
router.post("/oauth-register", registerOauth);

export default router;
