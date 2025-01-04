import express from "express";
import {
  createNote,
  getNote,
  getNotes,
  saveNote,
} from "../controllers/note.controller";
import { verifyJWT } from "../middlewares/verify-jwt";

const noteRoutes = express.Router();

noteRoutes.use(verifyJWT);
noteRoutes.get("/", getNotes);
noteRoutes.post("/", createNote);
noteRoutes.patch("/:id", saveNote);
noteRoutes.get("/:id", getNote);

export default noteRoutes;
