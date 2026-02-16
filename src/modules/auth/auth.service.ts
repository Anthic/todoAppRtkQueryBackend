import { PrismaClient } from "@prisma/client";
import type { AuthResponse, LoginDTO, RegisterDTO } from "./auth.type.ts";
import AppError from "../../errors/ApiError.ts";
import { comparePassword, hashPassword } from "../../utils/password.utils.ts";
import { generateToken, verifyToken } from "../../utils/jwt.util.ts";
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
      token: hashedToken,
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

//login part
const login = async (data: LoginDTO): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }
  if (!user.isActive) {
    throw new AppError(403, "Your account has been deactivated");
  }
  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }
  const accessToken = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    envVariable.JWT_SECRET,
    envVariable.JWT_ACCESS_EXPIRY,
  );

  const refreshToken = generateToken(
    { userId: user.id, email: user.email, role: user.role },
    envVariable.JWT_REFRESH_SECRET,
    envVariable.JWT_REFRESH_EXPIRY,
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Clean up old expired tokens
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
      expiresAt: { lt: new Date() },
    },
  });

  await prisma.refreshToken.create({
    data: {
      token: hashedToken,
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

const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    verifyToken(refreshToken, envVariable.JWT_REFRESH_SECRET);

    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    if (!storedToken.user.isActive) {
      throw new AppError(403, "Your account has been deactivated");
    }

    const newAccessToken = generateToken(
      {
        userId: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      },
      envVariable.JWT_SECRET,
      envVariable.JWT_ACCESS_EXPIRY,
    );

    const newRefreshToken = generateToken(
      {
        userId: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      },
      envVariable.JWT_REFRESH_SECRET,
      envVariable.JWT_REFRESH_EXPIRY,
    );

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    const newHashedToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // Delete old token and create new one atomically
    await prisma.$transaction([
      prisma.refreshToken.delete({
        where: { id: storedToken.id },
      }),
      prisma.refreshToken.create({
        data: {
          token: newHashedToken,
          userId: storedToken.user.id,
          expiresAt: newExpiresAt,
        },
      }),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "Invalid or expired refresh token");
  }
};

const logout = async (userId: number, refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: hashedToken,
      },
    });
  } else {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
};
export const authService = {
  register,
  login,
  refreshAccessToken,
  logout,
};
