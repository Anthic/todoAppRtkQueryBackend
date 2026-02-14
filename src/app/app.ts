import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error.middleware.js";

import notFound from "../middleware/notFoundPage.ts";
import { router } from "../routes/index.ts";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors());
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
