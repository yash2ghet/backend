import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./AppError";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string") {
    throw new AppError(401, "Invalid token");
  }

  return decoded as JwtPayload;
}