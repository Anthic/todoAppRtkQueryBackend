import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../shared/catchAsync.ts";
import { authService } from "./auth.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { setAuthCookie } from "../../utils/setCookies.ts";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  setAuthCookie(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
  sendResponse(res, {
    StatusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const authController = {
  register,
};
