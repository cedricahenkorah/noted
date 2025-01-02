import express from "express";
import authRoutes from "./auth.routes";
import noteRoutes from "./note.routes";

const api = express.Router();

api.use("/auth", authRoutes);
api.use("/notes", noteRoutes);

export default api;
