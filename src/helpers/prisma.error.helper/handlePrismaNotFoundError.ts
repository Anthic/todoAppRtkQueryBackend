import type { Prisma } from "@prisma/client";
import type {
  TErrorSource,
  TGenericErrorResponse,
} from "../../interface/erro.type.ts";

export const handlePrismaNotFoundError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = [
    {
      path: "",
      message: "Record not found in database",
    },
  ];
  return {
    statusCode: 404,
    message: "Record not found!",
    errorSource,
  };
};
