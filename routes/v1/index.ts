import { Router } from "express";
import authRouter from "./auth";

const v1Routers = Router();

v1Routers.use("/auth", authRouter);

export default v1Routers;