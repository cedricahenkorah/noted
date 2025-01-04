import express from "express";
import {
  createNote,
  getNote,
  getNotes,
  saveNote,
} from "../controllers/note.controller";
import { verifyJWT } from "../middlewares/verify-jwt";

const noteRoutes = express.Router();

noteRoutes.get("/", verifyJWT, getNotes);
noteRoutes.post("/", verifyJWT, createNote);
noteRoutes.patch("/:id", saveNote);
noteRoutes.get("/:id", getNote);

export default noteRoutes;
