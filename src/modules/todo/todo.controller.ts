import type { NextFunction, Request, Response } from "express";
import { todoService } from "./todo.service.js";
import AppError from "../../errors/ApiError.js";
export class TodoController {
  async listTodos(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw new AppError(401, "User not authenticated");
      }
      const todos = await todoService.getAllTodos(req.user.userId);
      res.json({
        success: true,
        data: todos,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw new AppError(401, "User not authenticated");
      }
      const todo = await todoService.getTodoById(
        Number(req.params.id),
        req.user.userId,
      );
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }
  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw new AppError(401, "User not authenticated");
      }
      const todo = await todoService.createTodo(
        req.body,
        req.user.userId,
        req.file,
      );
      res.status(201).json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }
  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw new AppError(401, "User not authenticated");
      }
      const updateData = { ...req.body };
      if (updateData.completed !== undefined) {
        updateData.completed =
          updateData.completed === "true" || updateData.completed === true;
      }

      const todo = await todoService.updateTodo(
        Number(req.params.id),
        req.user.userId,
        updateData,
        req.file,
      );
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw new AppError(401, "User not authenticated");
      }
      await todoService.deleteTodo(Number(req.params.id), req.user.userId);
      res.json({ success: true, message: "Deleted" });
    } catch (error) {
      next(error);
    }
  }

  async toggleTodo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw new AppError(401, "User not authenticated");
      }
      const todo = await todoService.toggleTodo(
        Number(req.params.id),
        req.user.userId,
      );
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }
}
export const todoController = new TodoController();
