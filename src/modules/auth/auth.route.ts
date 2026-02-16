import { Router } from "express";
import { zodValidation } from "../../middleware/zod.validation.ts";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.validation.ts";
import { authController } from "./auth.controller.ts";

const router = Router();

router.post(
  "/register",
  zodValidation(registerSchema),
  authController.register,
);
router.post("/login", zodValidation(loginSchema), authController.login);

router.post(
  "/refresh",
  zodValidation(refreshTokenSchema),
  authController.refreshToken,
);
export const AuthRoute = router;
