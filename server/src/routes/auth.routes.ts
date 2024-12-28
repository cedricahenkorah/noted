import express from "express";
import {
  emailLogin,
  emailSignup,
  googleAuth,
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/google-auth", googleAuth);
authRoutes.post("/email-auth", emailLogin);
authRoutes.post("/email-signup", emailSignup);

export default authRoutes;
