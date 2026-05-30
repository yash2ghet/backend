import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import { authMiddleware } from "../../middlewares/auth.middleware";

const v1Routers = Router();

v1Routers.use("/auth", authRouter);
v1Routers.use("/users", authMiddleware , usersRouter);

export default v1Routers;