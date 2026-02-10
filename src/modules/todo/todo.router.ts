import { Router } from "express";
import { todoController } from "./todo.controller.js";
import { validateResquest } from "../../middleware/validation.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();

router.get("/", todoController.listTodos.bind(todoController));
router.get("/:id", todoController.listTodos.bind(todoController));

router.post(
  "/",
  upload.single("image"),
  validateResquest([
    { field: "title", required: true, minLength: 1, type: "string" },
  ]),
  todoController.createTodo.bind(todoController),
);

router.patch(
  "/:id",
  upload.single("image"),
  todoController.updateTodo.bind(todoController),
);
router.patch("/:id/toggle", todoController.toggleTodo.bind(todoController));
router.delete("/:id", todoController.deleteTodo.bind(todoController));

export default router;
