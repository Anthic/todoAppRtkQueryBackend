import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../shared/catchAsync.ts";
import { authService } from "./auth.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { setAuthCookie } from "../../utils/setCookies.ts";
import AppError from "../../errors/ApiError.ts";

const register = catchAsync(async (req: Request, res: Response) => {
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
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  setAuthCookie(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  sendResponse(res, {
    StatusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body || {};
    const token = refreshToken || req.cookies?.refreshToken;
    if (!token) {
      throw new AppError(400, "Refresh token is required");
    }
    const result = await authService.refreshAccessToken(token);
    setAuthCookie(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    sendResponse(res, {
      StatusCode: 200,
      success: true,
      message: "Token refreshed successfull",
      data: result,
    });
  },
);

const logout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  if (!userId) {
    throw new AppError(401, "Not authenticated");
  }

  await authService.logout(userId, refreshToken);

  // Clear cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    StatusCode: 200,
    success: true,
    message: "Logout successful",
    data: null,
  });
});
export const authController = {
  register,
  login,
  refreshToken,
  logout,
};
