import { Router } from "express";
import { zodValidation } from "../../middleware/zod.validation.ts";
import { registerSchema } from "./auth.validation.ts";
import { authController } from "./auth.controller.ts";

const router = Router();

router.post(
  "/register",
  zodValidation(registerSchema),
  authController.register,
);

export const AuthRoute = router;
