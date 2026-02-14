import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route.ts";
import { todoRoute } from "../modules/todo/todo.router.ts";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/todos",
    route: todoRoute,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
