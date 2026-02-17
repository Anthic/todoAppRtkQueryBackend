import { Router } from "express";
import { zodValidation } from "../../middleware/zod.validation.ts";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  updatePasswordSchema,
} from "./auth.validation.ts";
import { authController } from "./auth.controller.ts";
import { authenticate } from "../../middleware/auth.middleware.ts";

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
router.post(
  "/update-password",
  authenticate,
  zodValidation(updatePasswordSchema),
  authController.updatePassword,
);
export const AuthRoute = router;
