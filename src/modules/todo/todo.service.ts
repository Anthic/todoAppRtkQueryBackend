import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../config/config.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../middleware/error.middleware.js";
import type { CreateTodoDTO, ITodo, UpdateTodoDTO } from "./todo.type.js";

const prisma = new PrismaClient();

export class TodoService {
  async getAllTodos(): Promise<ITodo[]> {
    return prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getTodoById(id: number): Promise<ITodo> {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new AppError(404, "Todo not found");
    return todo;
  }

  async createTodo(
    data: CreateTodoDTO,
    file?: Express.Multer.File,
  ): Promise<ITodo> {
    if (!data.title?.trim()) {
      throw new AppError(400, "Title is required");
    }

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (file) {
      const uploadResult = await uploadToCloudinary(file.buffer);
      imageUrl = uploadResult.imageUrl;
      imagePublicId = uploadResult.publicId;
    }

    try {
      return await prisma.todo.create({
        data: {
          title: data.title.trim(),
          completed: false,

          image: imageUrl,
          imagePublicId: imagePublicId,
        },
      });
    } catch (error) {
      if (imagePublicId) {
        await deleteFromCloudinary(imagePublicId).catch(() => {});
      }
      throw error;
    }
  }

  async updateTodo(
    id: number,
    data: UpdateTodoDTO,
    file?: Express.Multer.File,
  ): Promise<ITodo> {
    const existingTodo = await this.getTodoById(id);

    let imageUrl: string | null | undefined = data.image;
    let imagePublicId: string | null | undefined = undefined;
    if (file) {
      const uploadResult = await uploadToCloudinary(file.buffer);
      imageUrl = uploadResult.imageUrl;
      imagePublicId = uploadResult.publicId;
      if (existingTodo.imagePublicId) {
        await deleteFromCloudinary(existingTodo.imagePublicId).catch(() => {});
      }
    }

    const updateData: Partial<ITodo> = {
      ...data,
    };

    if (imageUrl !== undefined) {
      updateData.image = imageUrl;
    }
    if (imagePublicId !== undefined) {
      updateData.imagePublicId = imagePublicId;
    }
    return prisma.todo.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTodo(id: number): Promise<void> {
    const todo = await this.getTodoById(id);

    await prisma.todo.delete({
      where: { id },
    });

    // delete image AFTER DB delete
    if (todo.imagePublicId) {
      await deleteFromCloudinary(todo.imagePublicId).catch(() => {});
    }
  }

  async toggleTodo(id: number): Promise<ITodo> {
    const todo = await this.getTodoById(id);

    return prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });
  }
}

export const todoService = new TodoService();
