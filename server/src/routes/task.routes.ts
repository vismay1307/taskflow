import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  updateTaskController,
  deleteTaskController,
} from "../controllers/board.controller.js";

const router = Router();

router.use(protect);

router.patch("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;