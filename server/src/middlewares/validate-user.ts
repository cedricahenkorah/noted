import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { errorResponse } from "../utils/response";
import mongoose from "mongoose";
import User from "../models/user.model";

export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user: { id: string; email: string; name: string } = req.body.user;

  logger.info(
    `[validate-user.ts] [validateUser] Validating user: ${user.email}`
  );

  if (!user) {
    logger.error(
      `[validate-user.ts] [validateUser] Unauthorized access, user not found`
    );
    errorResponse(res, 401, "Unauthorized access");
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(user.id)) {
    logger.error(
      `[validate-user.ts] [validateUser] Unauthorized access, Invalid user ID: ${user.id}`
    );
    errorResponse(res, 401, "Unauthorized access");
    return;
  }

  try {
    const userExists = await User.findById(user.id)
      .select("-password")
      .lean()
      .exec();

    if (!userExists) {
      logger.error(
        `[validate-user.ts] [validateUser] User does not exist: ${user.email}`
      );
      errorResponse(res, 400, "User does not exist");
      return;
    }

    logger.info(
      `[validate-user.ts] [validateUser] User: ${user.email} exists and has been successfully validated`
    );
    req.body.user = userExists;
    next();
  } catch (error) {
    logger.error(
      `[validate-user.ts] [validateUser] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
