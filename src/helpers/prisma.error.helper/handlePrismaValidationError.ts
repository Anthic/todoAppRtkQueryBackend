import { Prisma } from "@prisma/client";
import type {
  TErrorSource,
  TGenericErrorResponse,
} from "../../interface/erro.type.ts";

export const handlePrismaValidationError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = [
    {
      path: "",
      message: err.message,
    },
  ];

  return {
    statusCode: 400,
    message: "Validation failed!",
    errorSource,
  };
};
