import { Role } from "@prisma/client";

// Main User interface (database model)
export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For creating a new user
export interface CreateUserDTO {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}

// For updating user
export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
  isActive?: boolean;
}

// User response (without password)
export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For user queries/filters
export interface UserQueryParams {
  role?: Role;
  isActive?: boolean;
  search?: string;
}