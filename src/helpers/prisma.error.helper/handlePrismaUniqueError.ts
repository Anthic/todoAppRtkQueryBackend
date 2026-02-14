import type { Prisma } from "@prisma/client";
import type { TErrorSource } from "../../interface/erro.type.ts";

export const handlePrismaUniqueError = (
  err: Prisma.PrismaClientKnownRequestError,
) => {
  const target = err.meta?.target as string[];
  const fieldName = target?.[0] ?? "field";
  const errorSource: TErrorSource[] = [
    {
      path: fieldName,
      message: `${fieldName} already exists!`,
    },
  ];
  return {
    statusCode: 400,
    message: `Duplicate entry. ${fieldName} must be unique.`,
    errorSource,
  };
};
