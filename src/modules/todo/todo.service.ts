import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../config/config.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../middleware/error.middleware.js";
import type { CreateTodoDTO, ITodo, UpdateTodoDTO } from "./todo.type.js";

const prisma = new PrismaClient();
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

  async createTodo(
    data: CreateTodoDTO,
    file?: Express.Multer.File,
  ): Promise<ITodo> {
    if (!data.title.trim()) {
      throw new AppError(400, "Title is required");
    }
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await uploadToCloudinary(file.buffer);
    }
    return await prisma.todo.create({
      data: {
        title: data.title.trim(),
        completed: false,
        image: imageUrl,
      },
    });
  }

  async updateTodo(
    id: number,
    data: UpdateTodoDTO,
    file?: Express.Multer.File,
  ): Promise<ITodo> {
    const existingTodo = await this.getTodoById(id);

    let imageUrl: string | null | undefined = data.image;

    if (file) {
      if (existingTodo.image) {
        await deleteFromCloudinary(existingTodo.image);
      }

      imageUrl = await uploadToCloudinary(file.buffer);
    }
    const updateData: any = { ...data };
    if (imageUrl !== undefined) {
      updateData.image = imageUrl;
    }
    return await prisma.todo.update({
      where: { id },
      data: updateData,
    });
  }
  async deleteTodo(id: number) {
    const todo = await this.getTodoById(id);

    if (todo.image) {
      await deleteFromCloudinary(todo.image);
    }

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
