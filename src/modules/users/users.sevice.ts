import { PrismaClient, Role } from "@prisma/client";

import { allowedFilterFields, userSearchableFields, userSelectFields } from "./user.constant.ts";
import AppError from "../../errors/ApiError.ts";
import type { IUser } from "./users.interface.ts";
import type { JWTPayload } from "../auth/auth.type.ts";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

const getAllUsers = async (query: Record<string, string>) => {
  const {
    search,
    sortBy,
    sortOrder,
    page = "1",
    limit = "10",
    ...filters
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;


  const searchCondition = search
    ? {
        OR: userSearchableFields.map((field) => ({
          [field]: {
            contains: search,
            mode: "insensitive",
          },
        })),
      }
    : {};


  const filterCondition = Object.keys(filters).length
    ? {
        AND: Object.keys(filters)
          .filter((key) => allowedFilterFields.includes(key))
          .map((key) => {
            if (key === "isActive") {
              return {
                [key]: {
                  equals: filters[key] === "true",
                },
              };
            }

            return {
              [key]: {
                equals: filters[key],
              },
            };
          }),
      }
    : {};

  const whereCondition = {
    ...searchCondition,
    ...filterCondition,
  };


  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
      orderBy: sortBy
        ? { [sortBy]: sortOrder === "desc" ? "desc" : "asc" }
        : { createdAt: "desc" },
      select: userSelectFields, 
    }),

    prisma.user.count({
      where: whereCondition,
    }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data,
  };
};



const getSingleUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
     throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist");
  }

  const { password, ...rest } = user;
  return {
    data: rest,
  };
};

const updateUser = async (
  userId: number,
  payload: Partial<IUser>,
  decodedToken: JWTPayload,
) => {
  if (decodedToken.role === Role.USER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }
  const isUserExist = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if ("isActive" in payload) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdateUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: payload,
  });
  const { password, ...userWithoutPassword } = newUpdateUser;
  return userWithoutPassword;
};
export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
};
