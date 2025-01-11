import express from "express";
import { verifyJWT } from "../middlewares/verify-jwt";
import { validateUser } from "../middlewares/validate-user";
import {
  addToNotebook,
  createNotebook,
} from "../controllers/notebook.controller";

const notebookRoutes = express.Router();

notebookRoutes.use(verifyJWT);
notebookRoutes.use(validateUser);
notebookRoutes.post("/", createNotebook);
notebookRoutes.patch("/add/:id", addToNotebook);

export default notebookRoutes;
