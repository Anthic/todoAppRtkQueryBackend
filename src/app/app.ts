import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error.middleware.js";
import router from "../modules/todo/todo.router.js";
import notFound from "../middleware/notFoundPage.ts";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/todos", router);
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
