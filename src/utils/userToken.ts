import type { JwtPayload } from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { generateToken, verifyToken } from "./jwt.util.ts";
import { envVariable } from "../config/env.ts";
import AppError from "../errors/ApiError.ts";

const prisma = new PrismaClient();

interface IUserTokenPayload {
  id: number;
  email: string;
  role: Role;
}

export const createUserTokens = (user: IUserTokenPayload) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVariable.JWT_SECRET,
    envVariable.JWT_ACCESS_EXPIRY,
  );

  const RefreshToken = generateToken(
    jwtPayload,
    envVariable.JWT_REFRESH_SECRET,
    envVariable.JWT_REFRESH_EXPIRY,
  );
  return {
    accessToken,
    RefreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string,
) => {
  //verify refresh Token
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVariable.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  //check if user exists in DB
  const isUserExist = await prisma.user.findUnique({
    where: { email: verifiedRefreshToken.email },
  });
  if (!isUserExist) {
    throw new AppError(400, "User does not exist");
  }
  //check if user is active
  if (!isUserExist.isActive) {
    throw new AppError(400, "User is blocked or inactive");
  }
  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVariable.JWT_SECRET,
    envVariable.JWT_ACCESS_EXPIRY,
  );
  return accessToken
};
