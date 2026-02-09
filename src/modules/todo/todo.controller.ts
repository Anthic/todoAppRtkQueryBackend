import type { NextFunction, Request, Response } from "express";
import { todoService } from "./todo.service.js";

export class TodoController {
  async listTodos(_req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await todoService.getAllTodos();
      res.json({
        sucess: true,

        data: todos,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await todoService.getTodoById(Number(req.params.id));
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }
  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await todoService.createTodo(req.body);
      res.status(201).json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }
  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await todoService.updateTodo(
        Number(req.params.id),
        req.body,
      );
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      await todoService.deleteTodo(Number(req.params.id));
      res.json({ success: true, message: "Deleted" });
    } catch (error) {
      next(error);
    }
  }

  async toggleTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await todoService.toggoleTodo(Number(req.params.id));
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }
}
export const todoController = new TodoController();
