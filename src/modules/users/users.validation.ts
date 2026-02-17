import { z } from "zod";
import { Role } from "@prisma/client";

// Create User Validation
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

// Update User Validation
export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

// User ID Param Validation
export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive().safe(),
});
