import { PrismaClient } from "@prisma/client";
import type { AuthResponse, RegisterDTO } from "./auth.type.ts";
import AppError from "../../errors/ApiError.ts";
import { hashPassword } from "../../utils/password.utils.ts";
import { generateToken } from "../../utils/jwt.util.ts";
import { envVariable } from "../../config/env.ts";
import crypto from "crypto";
const prisma = new PrismaClient();

const register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(409, "User with this email already exists");
  }
  //hash password
  const hashedPassword = await hashPassword(data.password);

  //create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name || null,
    },
  });

  //generate tokens
  const accessToken = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    envVariable.JWT_SECRET,
    envVariable.JWT_ACCESS_EXPIRY,
  );
  //refreshToken
  const refreshToken = generateToken(
    { userId: user.id, email: user.email, role: user.role },
    envVariable.JWT_REFRESH_SECRET,
    envVariable.JWT_REFRESH_EXPIRY,
  );

  //hashed the refreshToken

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  //hashed refreshToken
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};



export const authService = {
  register,
};
