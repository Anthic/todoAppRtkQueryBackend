import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.ts";
import { UserService } from "./users.sevice.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

import { PrismaClient } from "@prisma/client";
import type { JWTPayload } from "../auth/auth.type.ts";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserService.getAllUsers(
      query as Record<string, string>,
    );
    sendResponse(res, {
      success: true,
      StatusCode: 200,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new Error("Invalid user ID");
    }
    const result = await UserService.getSingleUser(numericId);
    sendResponse(res, {
      success: true,
      StatusCode: StatusCodes.OK,
      message: "User Retrieved Successfully",
      data: result.data,
    });
  },
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifyToken = req.user;
    const payload = req.body;
    const user = await UserService.updateUser(
      Number(userId),
      payload,
      verifyToken as JWTPayload,
    );

    sendResponse(res, {
      success: true,
      StatusCode: StatusCodes.OK,
      message: "User Updated Successfully",
      data: user,
    });
  },
);
export const UserController = {
  getAllUser,
  getSingleUser,
  updateUser,
};
