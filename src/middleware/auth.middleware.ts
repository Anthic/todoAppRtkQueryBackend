import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/ApiError.ts";
import { verifyToken } from "../utils/jwt.util.ts";
import { envVariable } from "../config/env.ts";

interface AuthTokenPayload extends JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies?.accessToken;
    }
    if (!token) {
      throw new AppError(401, "Authentication required. Please login.");
    }
    //verify token
    const decoded = verifyToken(
      token,
      envVariable.JWT_SECRET,
    ) as AuthTokenPayload;
    if (!decoded || !decoded.userId) {
      throw new AppError(401, "Invalid or expired token");
    }
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(new AppError(401, "Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new AppError(401, "Token expired. Please login again."));
    } else {
      next(error);
    }
  }
};

//Authorization middleware for role-based access
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "You don't have permission to access this resource"),
      );
    }
    next();
  };
};
