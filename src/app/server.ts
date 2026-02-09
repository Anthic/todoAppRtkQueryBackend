import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Todo server is running at ${PORT} .....`);
});

//gressfully shurt down
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  server.close(() => {
    console.log("Process terminated");
  });
});
