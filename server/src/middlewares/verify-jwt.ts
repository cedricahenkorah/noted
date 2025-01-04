import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { authorization } = req.headers;
  const secretKey = process.env.JWT_SECRET as string;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    errorResponse(res, 401, "Unauthorized access");
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.body.user = decoded.userInfo;

    next();
  } catch (error) {
    errorResponse(res, 401, "Unauthorized access");
    return;
  }
}
