import type { Response } from "express";
import { envVariable } from "../config/env.ts";

export interface AuthToken {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthToken) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVariable.NODE_ENV === "production",
      sameSite: "none",
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVariable.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};
