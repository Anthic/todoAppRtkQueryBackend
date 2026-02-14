// backend/src/modules/auth/auth.type.ts
import { Role } from "@prisma/client";

export interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string | null;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user?: JWTPayload;
}
