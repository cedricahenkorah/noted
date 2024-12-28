import { Request, Response } from "express";
import User from "../models/user.model";
import { generateJWT } from "../helpers/generate-jwt";
import { errorResponse, successResponse } from "../utils/response";
import { logger } from "../config/logger";
import bcrypt from "bcrypt";
import validator from "validator";

export async function emailSignup(req: Request, res: Response) {
  const { name, email, password } = req.body;
  logger.info(
    `[auth.controller.ts] [emailSignup] Creating a new account for User: ${email}`
  );

  try {
    if (!email || !password || !name) {
      logger.error(
        `[auth.controller.ts] [emailSignup] User: ${email}. Email, Name or Password not provided`
      );
      errorResponse(res, 400, "Please provide all the required information");
      return;
    }

    if (!validator.isEmail(email)) {
      logger.error(
        `[auth.controller.ts] [emailSignup] User: ${email}. Invalid email`
      );
      errorResponse(res, 400, "Invalid email");
      return;
    }

    const existingUser = await User.findOne({ email }).lean().exec();

    if (existingUser) {
      logger.error(
        `[auth.controller.ts] [emailSignup] User: ${email}. User already exists`
      );
      errorResponse(res, 400, "User already exists");
      return;
    }

    if (!validator.isStrongPassword(password)) {
      logger.error(
        `[auth.controller.ts] [emailSignup] User: ${email}. Password is not strong enough`
      );
      errorResponse(
        res,
        400,
        "Password must be at least 8 characters long, contain at least one number, one symbol and one uppercase letter"
      );
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    if (!user) {
      logger.error(
        `[auth.controller.ts] [emailSignup] User: ${email}. Something went wrong. Could not create user`
      );
      errorResponse(res, 400, "Something went wrong. Could not create user");
      return;
    }

    logger.info(
      `[auth.controller.ts] [emailSignup] User: ${email} created successfully`
    );

    successResponse(res, 201, "User created successfully", user);
    return;
  } catch (error) {
    logger.error(
      `[auth.controller.ts] [emailSignup] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function emailLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  logger.info(
    `[auth.controller.ts] [emailLogin] Authenticating User: ${email}`
  );

  try {
    if (!email || !password) {
      logger.info(
        `[auth.controller.ts] [emailLogin] User: ${email}. Email or Password not provided`
      );
      errorResponse(res, 400, "Please provide email and password");
      return;
    }

    const user = await User.findOne({ email }).lean().exec();

    if (!user) {
      logger.info(
        `[auth.controller.ts] [emailLogin] User: ${email}. User not found`
      );
      errorResponse(res, 400, "Invalid credentials");
      return;
    }

    const userPassword = user?.password as string;

    if (!userPassword) {
      logger.info(
        `[auth.controller.ts] [emailLogin] User: ${email}. Password not found`
      );
      errorResponse(res, 400, "Invalid credentials");
      return;
    }

    const match = await bcrypt.compare(password, userPassword);

    if (!match) {
      logger.info(
        `[auth.controller.ts] [emailLogin] User: ${email}. Passwords don't match`
      );
      errorResponse(res, 400, "Invalid credentials");
      return;
    }

    const accessToken = await generateJWT(user);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    logger.info(
      `[auth.controller.ts] [emailLogin] User: ${email} authenticated`
    );

    successResponse(res, 200, "User authenticated", { accessToken, user });
    return;
  } catch (error) {
    logger.error(
      `[auth.controller.ts] [emailLogin] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}

export async function googleAuth(req: Request, res: Response) {
  const { profile } = req.body;
  logger.info(
    `[auth.controller.ts] [googleAuth] Authenticating User: ${profile?.email}`
  );

  try {
    const userExists = await User.findOne({ email: profile.email })
      .lean()
      .exec();

    if (!userExists) {
      const user = await User.create({
        name: profile?.name,
        email: profile?.email,
        displayPhoto: profile?.picture,
      });

      const accessToken = await generateJWT(user);

      logger.info(
        `[auth.controller.ts] [googleAuth] User: ${profile?.email} created and authenticated`
      );
      successResponse(res, 200, "User created and authenticated", {
        accessToken,
        user,
      });
      return;
    }

    const user = userExists as any;
    const accessToken = await generateJWT(user);

    logger.info(
      `[auth.controller.ts] [googleAuth] User: ${profile?.email} authenticated`
    );
    successResponse(res, 200, "User authenticated", { accessToken, user });
    return;
  } catch (error) {
    console.log(error);
    logger.error(
      `[auth.controller.ts] [googleAuth] Internal Server Error ${error}`
    );
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
