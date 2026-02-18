import { Router } from "express";
import { todoController } from "./todo.controller.js";
import { validateResquest } from "../../middleware/validation.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.ts";

const router = Router();

router.get("/", authenticate, todoController.listTodos.bind(todoController));
router.get("/:id", authenticate, todoController.listTodos.bind(todoController));

router.post(
  "/",
  authenticate,
  upload.single("image"),
  validateResquest([
    { field: "title", required: true, minLength: 1, type: "string" },
  ]),
  todoController.createTodo.bind(todoController),
);

router.patch(
  "/:id",
  authenticate,
  upload.single("image"),
  todoController.updateTodo.bind(todoController),
);
router.patch(
  "/:id/toggle",
  authenticate,
  todoController.toggleTodo.bind(todoController),
);
router.delete(
  "/:id",
  authenticate,
  todoController.deleteTodo.bind(todoController),
);

export const todoRoute = router;
