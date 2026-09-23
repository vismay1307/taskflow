import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createBoard,
  getBoards,
  getBoardById,
  createTask,
  updateTask,
  deleteTask,
} from "../services/board.service.js";

import { TaskStatus } from "../models/Task.js";

// POST /api/boards
export const createBoardController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Board name is required",
      });
    }

    const board = await createBoard(
      name,
      req.user!.userId
    );

    return res.status(201).json({
      success: true,
      board,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/boards
export const getBoardsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const boards = await getBoards(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      boards,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/boards/:id
export const getBoardController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const board = await getBoardById(
      String(req.params.id),
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      board,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/boards/:id/tasks
export const createTaskController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      status,
      order,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await createTask(
      String(req.params.id),
      req.user!.userId,
      title,
      status as TaskStatus | undefined,
      order
    );

    return res.status(201).json({
      success: true,
      task,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/tasks/:id
export const updateTaskController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      status,
      order,
    } = req.body;

    const task = await updateTask(
      String(req.params.id),
      req.user!.userId,
      {
        title,
        status,
        order,
      }
    );

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/tasks/:id
export const deleteTaskController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await deleteTask(
      String(req.params.id),
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};  