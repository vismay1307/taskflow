import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  createBoardController,
  getBoardsController,
  getBoardController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/board.controller.js";

const router = Router();

router.use(protect);

// BOARD
router.post("/", createBoardController);
router.get("/", getBoardsController);
router.get("/:id", getBoardController);

// TASK
router.post("/:id/tasks", createTaskController);

export default router;