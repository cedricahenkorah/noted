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

export async function getNotebooks(req: Request, res: Response) {
  const user: { _id: string; email: string; name: string } = req.body.user;
  const page: number = parseInt(req.query.page as string) || 1;
  const perPage: number = parseInt(req.query.limit as string) || 10;

  logger.info(
    `[notebook.controller.ts] [getNotebooks] Fetching notebooks for user: ${user.email}`
  );

  try {
    const notebooks = await Notebook.aggregate([
      {
        $match: {
          author: user._id,
        },
      },
      {
        $lookup: {
          from: "notes",
          localField: "_id", // Notebook ID
          foreignField: "notebook", // Notebook reference in notes
          as: "notes", // Alias for the joined array
        },
      },
      {
        $lookup: {
          from: "audionotes",
          localField: "_id",
          foreignField: "notebook",
          as: "audionotes",
        },
      },
      {
        $addFields: {
          notesCount: { $size: "$notes" }, // Add a field for the note count
          audiosCount: { $size: "$audionotes" },
        },
      },
      {
        $project: {
          notes: 0, // Exclude the notes array from the final result
          audionotes: 0,
        },
      },
    ])
      .sort({ updatedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!notebooks) {
      logger.error(
        `[notebook.controller.ts] [getNotebooks] Could not fetch notebooks for the user: ${user.email}`
      );
      errorResponse(res, 404, "No notebooks found");
      return;
    }

    if (notebooks && notebooks.length === 0) {
      logger.info(
        `[notebook.controller.ts] [getNotebooks] Notebooks fetched successfully but empty for user: ${user.email}`
      );
      successResponse(res, 200, "Notebooks fetched successfully", notebooks);
      return;
    }

    logger.info(
      `[notebook.controller.ts] [getNotebooks] Notebooks fetched successfully for the user: ${user.email}`
    );
    successResponse(res, 200, "Notebooks fetched successfully", notebooks);
    return;
  } catch (error) {
    logger.error(
      `[notebook.controller.ts] [getNotebooks] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
