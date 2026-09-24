import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  createBoardController,
  getBoardsController,
  getBoardController,
  createTaskController,
  updateTaskController,
  deleteTaskController,getTasksController,
} from "../controllers/board.controller.js";

const router = Router();

router.use(protect);

// BOARD
router.post("/", createBoardController);
router.get("/", getBoardsController);
router.get("/:id", getBoardController);

// TASK
router.post("/:id/tasks", createTaskController);
router.get(
  "/:id/tasks",
  getTasksController
);
export default router;