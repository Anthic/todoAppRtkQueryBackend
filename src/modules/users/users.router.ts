import { Router } from "express";
import { UserController } from "./users.controller.ts";
import { authenticate, authorize } from "../../middleware/auth.middleware.ts";
import { Role } from "@prisma/client";
import { zodValidation } from "../../middleware/zod.validation.ts";
import { updateUserSchema } from "./users.validation.ts";

const router = Router();
router.get(
  "/all-users",
  authenticate,
  authorize(Role.ADMIN),
  UserController.getAllUser,
);
router.get(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  UserController.getSingleUser,
);
router.patch(
  "/:id",
  authenticate,
  zodValidation(updateUserSchema),
  authorize(...Object.values(Role)),
  UserController.updateUser,
);

export const UserRouter = router;
