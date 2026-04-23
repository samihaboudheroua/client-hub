import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import requestsRouter from "./requests";
import filesRouter from "./files";
import commentsRouter from "./comments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(requestsRouter);
router.use(filesRouter);
router.use(commentsRouter);

export default router;
