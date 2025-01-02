import express from "express";
import { createNote, getNote, saveNote } from "../controllers/note.controller";

const noteRoutes = express.Router();

noteRoutes.post("/", createNote);
noteRoutes.patch("/:id", saveNote);
noteRoutes.get("/:id", getNote);

export default noteRoutes;
