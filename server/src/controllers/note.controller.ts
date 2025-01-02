import { Request, Response } from "express";
import { logger } from "../config/logger";
import { errorResponse, successResponse } from "../utils/response";
import User from "../models/user.model";
import Note from "../models/note.model";
import mongoose from "mongoose";

export async function createNote(req: Request, res: Response) {
  const { author } = req.body;

  logger.info(
    `[note.controller.ts] [createNote] User: ${author} creating a new note`
  );

  try {
    if (!author) {
      logger.error(`[note.controller.ts] [createNote] Author is required`);
      errorResponse(res, 400, "Author is required");
      return;
    }

    const user = await User.findById(author).select("-password").lean().exec();

    if (!user) {
      logger.error(
        `[note.controller.ts] [createNote] User: ${author} not found`
      );
      errorResponse(res, 400, "User not found");
      return;
    }

    const note = await Note.create({ author });

    if (!note) {
      logger.error(
        `[note.controller.ts] [createNote] User: ${author} failed to create note`
      );
      errorResponse(res, 400, "Failed to create note");
      return;
    }

    logger.info(
      `[note.controller.ts] [createNote] User: ${user.email} created a new note: ${note._id}`
    );

    successResponse(res, 201, "Note created successfully", note);
  } catch (error) {
    logger.error(
      `[note.controller.ts] [createNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function saveNote(req: Request, res: Response) {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  logger.info(`[note.controller.ts] [saveNote] Saving note: ${id}`);

  try {
    if (!title || !content) {
      logger.error(
        `[note.controller.ts] [saveNote] Title and Content are required`
      );
      errorResponse(res, 400, "Missing required fields");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`[note.controller.ts] [saveNote] Invalid note id: ${id}`);
      errorResponse(res, 400, "Invalid note id");
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, tags },
      { new: true }
    )
      .lean()
      .exec();

    if (!note) {
      logger.error(
        `[note.controller.ts] [saveNote] Could not save the note: ${id}`
      );
      errorResponse(res, 400, "Could not save the note");
      return;
    }

    logger.info(
      `[note.controller.ts] [saveNote] Note: ${note._id} saved successfully`
    );
    successResponse(res, 200, "Note saved successfully", note);
    return;
  } catch (error) {
    logger.error(
      `[note.controller.ts] [saveNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function getNote(req: Request, res: Response) {
  const { id } = req.params;

  logger.info(`[note.controller.ts] [getNote] Fetching note: ${id}`);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`[note.controller.ts] [getNote] Invalid note ID: ${id}`);
      errorResponse(res, 400, "Invalid note ID");
    }

    const note = await Note.findById(id).lean().exec();

    if (!note) {
      logger.error(`[note.controller.ts] [getNote] Could not find note: ${id}`);
      errorResponse(res, 404, "The note does not exist");
    }

    logger.info(
      `[note.controller.ts] [getNote] Note: ${note?._id} fetched successfully`
    );
    successResponse(res, 200, "Note fetched successfully", note);
  } catch (error) {
    logger.error(
      `[note.controller.ts] [getNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
