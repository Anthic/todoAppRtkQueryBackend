
import { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../middleware/error.middleware.js";
import type { CreateTodoDTO, ITodo, UpdateTodoDTO } from "./todo.type.js";
  

const prisma = new PrismaClient()
export class TodoService {
  async getAllTodos() {
    return await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getTodoById(id: number) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new AppError(404, "Todo not found");
    return todo;
  }

  async createTodo(data: CreateTodoDTO): Promise<ITodo> {
    if (!data.title.trim()) {
      throw new AppError(400, "Title is required");
    }
    return await prisma.todo.create({
      data: { title: data.title.trim(), completed: false },
    });
  }

  async updateTodo(id: number, data: UpdateTodoDTO): Promise<ITodo> {
    await this.getTodoById(id);
    return await prisma.todo.update({
      where: { id },
      data,
    });
  }
  async deleteTodo(id: number) {
    await this.getTodoById(id);
    await prisma.todo.delete({
      where: { id },
    });
  }
  async toggoleTodo(id: number) {
    const todo = await this.getTodoById(id);
    return await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });
  }
}
export const todoService = new TodoService();
