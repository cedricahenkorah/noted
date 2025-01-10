import express from "express";
import { verifyJWT } from "../middlewares/verify-jwt";
import {
  createAudioNote,
  getAudioNotes,
  saveAudioNote,
} from "../controllers/audio-note.controller";
import { validateUser } from "../middlewares/validate-user";

const audioNoteRoutes = express.Router();

audioNoteRoutes.use(verifyJWT);
audioNoteRoutes.use(validateUser);
audioNoteRoutes.get("/", getAudioNotes);
audioNoteRoutes.post("/", createAudioNote);
audioNoteRoutes.patch("/:id", saveAudioNote);

export default audioNoteRoutes;
