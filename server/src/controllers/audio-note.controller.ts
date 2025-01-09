import { Request, Response } from "express";
import { logger } from "../config/logger";
import { errorResponse, successResponse } from "../utils/response";
import mongoose from "mongoose";
import User from "../models/user.model";
import AudioNote from "../models/audio-note.model";

export async function createAudioNote(req: Request, res: Response) {
  const user: { id: string; email: string; name: string } = req.body.user;

  logger.info(
    `[audio-note.controller.ts] [createAudioNote] User: ${user.email} is creating an audio note`
  );

  try {
    if (!user) {
      logger.error(
        `[audio-note.controller.ts] [createAudioNote] Unauthorized access, user not found`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      logger.error(
        `[audio-note.controller.ts] [createAudioNote] Unauthorized access, Invalid user ID: ${user.id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    const userExists = await User.findById(user.id)
      .select("-password")
      .lean()
      .exec();

    if (!userExists) {
      logger.error(
        `[audio-note.controller.ts] [createAudioNote] User does not exist: ${user.email}`
      );
      errorResponse(res, 400, "User does not exist");
      return;
    }

    const audioNote = await AudioNote.create({ author: user.id });

    if (!audioNote) {
      logger.error(
        `[audio-note.controller.ts] [createAudioNote] User: ${user.email} failed to create an audio note`
      );
      errorResponse(res, 400, "Failed to create an audio note");
      return;
    }

    logger.error(
      `[audio-note.controller.ts] [createAudioNote] User: ${user.email} created a new audio note: ${audioNote._id}`
    );

    successResponse(res, 201, "Audio Note created successfully", audioNote);
    return;
  } catch (error) {
    logger.error(
      `[audio-note.controller.ts] [createAudioNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function saveAudioNote(req: Request, res: Response) {
  const user: { id: string; email: string; name: string } = req.body.user;
  const { id } = req.params;
  const { title, url, recordingTime } = req.body;

  logger.info(
    `[audio-note.controller.ts] [saveAudioNote] Saving audio note: ${id} for user: ${user.email}`
  );

  try {
    if (!user) {
      logger.error(
        `[audio-note.controller.ts] [saveAudioNote] Unauthorized access, user not found`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      logger.error(
        `[audio-note.controller.ts] [saveAudioNote] Unauthorized access, Invalid user ID: ${user.id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    const userExists = await User.findById(user.id)
      .select("-password")
      .lean()
      .exec();

    if (!userExists) {
      logger.error(
        `[audio-note.controller.ts] [saveAudioNote] User does not exist: ${user.email}`
      );
      errorResponse(res, 400, "User does not exist");
      return;
    }

    if (!title || !url || !recordingTime) {
      console.log(title, url, recordingTime);
      logger.error(
        `[audio-note.controller.ts] [saveAudioNote] Audio note: ${id} is missing required fields`
      );
      errorResponse(res, 400, "Missing required fields");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(
        `[audio-note.controller.ts] [saveAudioNote] Invalid audio note ID: ${id}`
      );
      errorResponse(res, 400, "Invalid audio note ID");
      return;
    }

    const audioNote = await AudioNote.findByIdAndUpdate(
      id,
      { title, url, recordingTime },
      { new: true }
    )
      .lean()
      .exec();

    if (!audioNote) {
      logger.error(
        `[audio-note.controller.ts] [saveAudioNote] Could not save the audio note: ${id}`
      );
      errorResponse(res, 400, "Could not save the audio note");
      return;
    }

    logger.info(
      `[audio-note.controller.ts] [saveAudioNote] Audio note: ${id} saved successfully`
    );
    successResponse(res, 200, "Audio note saved successfully", audioNote);
    return;
  } catch (error) {
    logger.error(
      `[audio-note.controller.ts] [saveAudioNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function getAudioNotes(req: Request, res: Response) {
  const user: { id: string; email: string; name: string } = req.body.user;
  const page: number = parseInt(req.query.page as string) || 1;
  const perPage: number = parseInt(req.query.limit as string) || 10;

  logger.info(
    `[audio-note.controller.ts] [getAudioNotes] Fetching audio notes for user: ${user.email}`
  );

  try {
    if (!user) {
      logger.error(
        `[audio-note.controller.ts] [getAudioNotes] Unauthorized access, user not found`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      logger.error(
        `[audio-note.controller.ts] [getAudioNotes] Unauthorized access, Invalid user ID: ${user.id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    const userExists = await User.findById(user.id)
      .select("-password")
      .lean()
      .exec();

    if (!userExists) {
      logger.error(
        `[audio-note.controller.ts] [getAudioNotes] User does not exist: ${user.email}`
      );
      errorResponse(res, 400, "User does not exist");
      return;
    }

    const audioNotes = await AudioNote.find({ author: user.id })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
      .exec();

    if (!audioNotes) {
      logger.error(
        `[audio-note.controller.ts] [getAudioNotes] Could not fetch audio notes for the user: ${user.email}`
      );
      errorResponse(res, 400, "No audio notes found");
      return;
    }

    if (audioNotes && audioNotes.length === 0) {
      logger.info(
        `[audio-note.controller.ts] [getAudioNotes] Audio notes fetched successfully but no audio notes found for the user: ${user.email}`
      );
      successResponse(res, 200, "Audio notes fetched successfully", audioNotes);
      return;
    }

    logger.info(
      `[audio-note.controller.ts] [getAudioNotes] Audio notes fetched successfully for the user: ${user.email}`
    );
    successResponse(res, 200, "Audio notes fetched successfully", audioNotes);
    return;
  } catch (error) {
    logger.error(
      `[audio-note.controller.ts] [getAudioNotes] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
