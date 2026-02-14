import type { NextFunction, Request, Response } from "express";
import { envVariable } from "../config/env.ts";
import { deleteFromCloudinary } from "../config/config.ts";
import type { TErrorSource } from "../interface/erro.type.ts";
import { Prisma } from "@prisma/client";
import { handlePrismaUniqueError } from "../helpers/prisma.error.helper/handlePrismaUniqueError.ts";
import { handlePrismaNotFoundError } from "../helpers/prisma.error.helper/handlePrismaNotFoundError.ts";
import { handlePrismaValidationError } from "../helpers/prisma.error.helper/handlePrismaValidationError.ts";
import { handlePrismaForeignKeyError } from "../helpers/prisma.error.helper/handlePrismaForeignKeyError.ts";
import AppError from "../errors/ApiError.ts";

export const errorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVariable.NODE_ENV === "development") {
    console.log(err);
  }
  console.log({ file: req.file });

  if (req.file) {
    await deleteFromCloudinary(req.file.path);
  }

  if (req.file && Array.isArray(req.file) && req.file.length) {
    const imageUrl = (req.file as Express.Multer.File[]).map(
      (file) => file.path,
    );

    await Promise.all(imageUrl.map((url) => deleteFromCloudinary(url)));
  }
  let errorSource: TErrorSource[] = [];
  let statusCode: number = 500;
  let message: string = "Something Went Worng!";
  //prisma error handler
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      //unique constraint violation
      const simplifiedError = handlePrismaUniqueError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSource = simplifiedError.errorSource || [];
    } else if (err.code === "P2025") {
      //Record not found
      const simplifiedError = handlePrismaNotFoundError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSource = simplifiedError.errorSource || [];
    } else if (err.code === "P2003") {
      // Foreign key constraint
      const simplifiedError = handlePrismaForeignKeyError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSource = simplifiedError.errorSource || [];
    } else if (err.code === "P2000") {
      // Validation error
      const simplifiedError = handlePrismaValidationError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSource = simplifiedError.errorSource || [];
    } else if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (err instanceof Error) {
      statusCode = 500;
      message = err.message;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err: envVariable.NODE_ENV === "development" ? err : null,
    stack: envVariable.NODE_ENV === "development" ? err.stack : null,
  });
};
