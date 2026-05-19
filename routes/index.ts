import { Router } from "express";
import v1Routers from "./v1";
import v2Routers from "./v2";
import authRouter from "./v1/index.ts";

const apiRouter = Router();

apiRouter.use("/v1", v1Routers);
apiRouter.use("/v2", v2Routers);

export default apiRouter;