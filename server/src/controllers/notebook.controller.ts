import { Request, Response } from "express";
import { logger } from "../config/logger";
import Notebook from "../models/notebook.model";
import { errorResponse, successResponse } from "../utils/response";
import mongoose from "mongoose";
import AudioNote from "../models/audio-note.model";
import Note from "../models/note.model";

export async function createNotebook(req: Request, res: Response) {
  const user: { _id: string; email: string; name: string } = req.body.user;
  const { title, description } = req.body;

  logger.info(
    `[notebook.controller.ts] [createNotebook] User: ${user.email} is creating a notebook`
  );

  try {
    if (!title) {
      logger.error(
        `[notebook.controller.ts] [createNotebook] User: ${user.email} is missing a required field to create the notebook`
      );
      errorResponse(res, 400, "Missing required fields");
      return;
    }

    const notebook = await Notebook.create({
      author: user._id,
      title,
      description,
    });

    if (!notebook) {
      logger.error(
        `[notebook.controller.ts] [createNotebook] User: ${user.email} failed to create a notebook`
      );
      errorResponse(res, 400, "Failed to create a notebook");
      return;
    }

    logger.info(
      `[notebook.controller.ts] [createNotebook] User: ${user.email} created a new notebook: ${notebook._id}`
    );
    successResponse(res, 201, "Notebook created successfully", notebook);
    return;
  } catch (error) {
    logger.error(
      `[notebook.controller.ts] [createNotebook] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function addToNotebook(req: Request, res: Response) {
  const user: { _id: string; email: string; name: string } = req.body.user;
  const { id } = req.params;
  const { type, typeID } = req.body;

  logger.info(
    `[notebook.controller.ts] [addToNotebook] User: ${user.email} is adding ${type}: ${typeID} to notebook: ${id}`
  );

  try {
    if (!type || !typeID) {
      logger.error(
        `[notebook.controller.ts] [addToNotebook] Notebook: ${id} is missing required fields`
      );
      errorResponse(res, 400, "Missing required fields");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(
        `[notebook.controller.ts] [addToNotebook] Invalid notebook ID: ${id}`
      );
      errorResponse(res, 400, "Invalid notebook ID");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(typeID)) {
      logger.error(
        `[notebook.controller.ts] [addToNotebook] Invalid audio / note ID: ${id}`
      );
      errorResponse(res, 400, "Invalid audio / note ID");
      return;
    }

    let data;

    switch (type) {
      case "audio":
        data = await AudioNote.findByIdAndUpdate(
          typeID,
          {
            $push: { notebook: id },
          },
          { new: true }
        );
        break;

      case "note":
        data = await Note.findByIdAndUpdate(
          typeID,
          { $push: { notebook: id } },
          { new: true }
        );

      default:
        break;
    }

    if (!data) {
      logger.error(
        `[notebook.controller.ts] [addToNotebook] User: ${user.email} could not add the ${type}: ${typeID} to the notebook: ${id}`
      );
      errorResponse(res, 400, "Could not add the audio / note to the notebook");
      return;
    }

    logger.info(
      `[notebook.controller.ts] [addToNotebook] User successfully added ${type}: ${typeID} to the notebook: ${id}`
    );
    successResponse(
      res,
      200,
      "Audio / note successfully added to the notebook",
      data
    );
    return;
  } catch (error) {
    logger.error(
      `[notebook.controller.ts] [addToNotebook] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
