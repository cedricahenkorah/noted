import express from "express";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  saveNote,
} from "../controllers/note.controller";
import { verifyJWT } from "../middlewares/verify-jwt";
import { validateUser } from "../middlewares/validate-user";

const noteRoutes = express.Router();

noteRoutes.use(verifyJWT);
noteRoutes.use(validateUser);
noteRoutes.get("/", getNotes);
noteRoutes.post("/", createNote);
noteRoutes.patch("/:id", saveNote);
noteRoutes.get("/:id", getNote);
noteRoutes.delete("/:id", deleteNote);

export default noteRoutes;
