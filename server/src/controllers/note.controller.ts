import { Request, Response } from "express";
import { logger } from "../config/logger";
import { errorResponse, successResponse } from "../utils/response";
import User from "../models/user.model";
import Note from "../models/note.model";
import mongoose from "mongoose";

export async function createNote(req: Request, res: Response) {
  const user: { id: string; email: string; name: string } = req.body.user;

  logger.info(
    `[note.controller.ts] [createNote] User: ${user.email} creating a new note`
  );

  try {
    if (!user) {
      logger.error(
        `[note.controller.ts] [createNote] Unauthorized access, user not found`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      logger.error(
        `[note.controller.ts] [getNotes] Unauthorized access, Invalid user ID: ${user.id}`
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
        `[note.controller.ts] [createNote] User does not exist: ${user.email}`
      );
      errorResponse(res, 400, "User does not exist");
      return;
    }

    const note = await Note.create({ author: user.id });

    if (!note) {
      logger.error(
        `[note.controller.ts] [createNote] User: ${user.email} failed to create note`
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
  const user: { id: string; email: string; name: string } = req.body.user;
  const { id } = req.params;
  const { title, content, tags } = req.body;

  logger.info(
    `[note.controller.ts] [saveNote] Saving note: ${id} for user: ${user.email}`
  );

  try {
    if (!user) {
      logger.error(
        `[note.controller.ts] [saveNote] Unauthorized access to note: ${id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      logger.error(
        `[note.controller.ts] [saveNote] Invalid user ID: ${user.id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!title || !content) {
      logger.error(
        `[note.controller.ts] [saveNote] Note: ${id} is missing required fields`
      );
      errorResponse(res, 400, "Missing required fields");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`[note.controller.ts] [saveNote] Invalid note id: ${id}`);
      errorResponse(res, 400, "Invalid note ID");
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
  const user: { id: string; email: string; name: string } = req.body.user;
  const { id } = req.params;

  logger.info(
    `[note.controller.ts] [getNote] Fetching note: ${id} for user: ${user.email}`
  );

  try {
    if (!user) {
      logger.error(
        `[note.controller.ts] [getNote] Unauthorized access to note: ${id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      logger.error(
        `[note.controller.ts] [getNote] Invalid user ID: ${user.id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

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

export async function getNotes(req: Request, res: Response) {
  const user: { id: string; email: string; name: string } = req.body.user;
  const page: number = parseInt(req.query.page as string) || 1;
  const perPage: number = parseInt(req.query.limit as string) || 10;

  logger.info(
    `[note.controller.ts] [getNotes] Fetching notes for user: ${user.email}`
  );

  try {
    if (!user) {
      logger.error(
        `[note.controller.ts] [getNotes] Unauthorized access, user not found`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      logger.error(
        `[note.controller.ts] [getNotes] Unauthorized access, Invalid user ID: ${user.id}`
      );
      errorResponse(res, 401, "Unauthorized access");
      return;
    }

    const userExists = await User.findById(user.id).lean().exec();

    if (!userExists) {
      logger.error(
        `[note.controller.ts] [getNotes] User does not exist: ${user.email}`
      );
      errorResponse(res, 404, "User does not exist");
      return;
    }

    const notes = await Note.find({ author: user.id })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
      .exec();

    if (!notes) {
      logger.error(
        `[note.controller.ts] [getNotes] Could not fetch notes for the user: ${user.email}`
      );
      errorResponse(res, 404, "No notes found");
      return;
    }

    if (notes && notes.length === 0) {
      logger.info(
        `[note.controller.ts] [getNotes] Notes fetched successfully but no notes found for the user: ${user.email}`
      );
      successResponse(res, 200, "Notes fetched successfully", notes);
      return;
    }

    logger.info(
      `[note.controller.ts] [getNotes] Notes fetched successfully for user: ${user.email}`
    );
    successResponse(res, 200, "Notes fetched successfully", notes);
    return;
  } catch (error) {
    logger.error(
      `[note.controller.ts] [getNotes] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
