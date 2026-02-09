import { Router } from "express";
import { todoController } from "./todo.controller.js";
import { validateResquest } from "../../middleware/validation.middleware.js";

const router = Router();

router.get("/", todoController.listTodos.bind(todoController));
router.get("/:id", todoController.listTodos.bind(todoController));

router.post(
  "/",
  validateResquest([
    { field: "title", required: true, minLength: 1, type: "string" },
  ]),
  todoController.createTodo.bind(todoController),
);
router.patch("/:id", todoController.updateTodo.bind(todoController));
router.delete("/:id", todoController.deleteTodo.bind(todoController));
router.post("/:id/toggle", todoController.toggleTodo.bind(todoController));

export default router