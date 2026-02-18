import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error.middleware.js";

import notFound from "../middleware/notFoundPage.ts";
import { router } from "../routes/index.ts";
import cookieParser from "cookie-parser";
import { envVariable } from "../config/env.ts";

export const app = express();

app.use(
  cors({
    origin: envVariable.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
//health check
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

app.use(errorMiddleware);

app.use(notFound);
export default app;
