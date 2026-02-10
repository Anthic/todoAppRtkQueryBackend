import type { Request } from "express";
import multer from "multer";
import { AppError } from "./error.middleware.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const allowedExtensions = [".jpeg", ".jpg", ".png", ".gif", ".webp"];

const fileFilter = async (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const ext = file.originalname
    .toLowerCase()
    .slice(file.originalname.lastIndexOf("."));

  if (!allowedExtensions.includes(ext)) {
    return cb(new AppError(400, "Invalid file extension"));
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new AppError(400, "Invalid file type"));
  }

  // multer fileFilter sync by default
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
