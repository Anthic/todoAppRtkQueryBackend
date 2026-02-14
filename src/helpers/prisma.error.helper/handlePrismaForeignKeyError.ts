import { Prisma } from "@prisma/client";
import type {
  TErrorSource,
  TGenericErrorResponse,
} from "../../interface/erro.type.ts";

export const handlePrismaForeignKeyError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  const fieldName = err.meta?.field_name as string | undefined;

  const errorSource: TErrorSource[] = [
    {
      path: fieldName || "foreign_key",
      message: "Foreign key constraint failed",
    },
  ];

  return {
    statusCode: 400,
    message: "Invalid reference. Related record does not exist.",
    errorSource,
  };
};
