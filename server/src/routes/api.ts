import express from "express";
import authRoutes from "./auth.routes";
import noteRoutes from "./note.routes";
import audioNoteRoutes from "./audio-note.routes";

const api = express.Router();

api.use("/auth", authRoutes);
api.use("/notes", noteRoutes);
api.use("/audio-notes", audioNoteRoutes);

export default api;
