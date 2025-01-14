import { Request, Response } from "express";
import { logger } from "../config/logger";
import { errorResponse, successResponse } from "../utils/response";
import User from "../models/user.model";
import Note from "../models/note.model";
import mongoose from "mongoose";

export async function createNote(req: Request, res: Response) {
  const user: { _id: string; email: string; name: string } = req.body.user;

  logger.info(
    `[note.controller.ts] [createNote] User: ${user.email} creating a new note`
  );

  try {
    const note = await Note.create({ author: user._id });

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
    return;
  } catch (error) {
    logger.error(
      `[note.controller.ts] [createNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function saveNote(req: Request, res: Response) {
  const user: { _id: string; email: string; name: string } = req.body.user;
  const { id } = req.params;
  const { title, content, tags } = req.body;

  logger.info(
    `[note.controller.ts] [saveNote] Saving note: ${id} for user: ${user.email}`
  );

  try {
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
      return;
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
  const user: { _id: string; email: string; name: string } = req.body.user;
  const { id } = req.params;

  logger.info(
    `[note.controller.ts] [getNote] Fetching note: ${id} for user: ${user.email}`
  );

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`[note.controller.ts] [getNote] Invalid note ID: ${id}`);
      errorResponse(res, 400, "Invalid note ID");
      return;
    }

    const note = await Note.findById(id).lean().exec();

    if (!note) {
      logger.error(`[note.controller.ts] [getNote] Could not find note: ${id}`);
      errorResponse(res, 404, "The note does not exist");
      return;
    }

    logger.info(
      `[note.controller.ts] [getNote] Note: ${note?._id} fetched successfully`
    );
    successResponse(res, 200, "Note fetched successfully", note);
    return;
  } catch (error) {
    logger.error(
      `[note.controller.ts] [getNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function getNotes(req: Request, res: Response) {
  const user: { _id: string; email: string; name: string } = req.body.user;
  const page: number = parseInt(req.query.page as string) || 1;
  const perPage: number = parseInt(req.query.limit as string) || 10;

  logger.info(
    `[note.controller.ts] [getNotes] Fetching notes for user: ${user.email}`
  );

  try {
    const notes = await Note.find({ author: user._id })
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

export async function deleteNote(req: Request, res: Response) {
  const user: { _id: string; email: string; name: string } = req.body.user;
  const { id } = req.params;

  logger.info(
    `[note.controller.ts] [deleteNote] Deleting note: ${id} for user: ${user.email}`
  );

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`[note.controller.ts] [deleteNote] Invalid note id: ${id}`);
      errorResponse(res, 400, "Invalid note ID");
      return;
    }

    const noteDeleted = await Note.findByIdAndDelete(id);

    if (!noteDeleted) {
      logger.error(
        `[note.controller.ts] [deleteNote] Could not save the note: ${id}`
      );
      errorResponse(res, 400, "Could not delete the note");
      return;
    }

    logger.info(
      `[note.controller.ts] [deleteNote] Note: ${noteDeleted._id} deleted successfully`
    );
    successResponse(res, 200, "Note deleted successfully");
    return;
  } catch (error) {
    logger.error(
      `[note.controller.ts] [deleteNote] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
