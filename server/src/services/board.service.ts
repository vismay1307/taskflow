import mongoose from "mongoose";

import Board from "../models/Board.js";
import Task, { TaskStatus } from "../models/Task.js";

import { getIO } from "../config/socket.js";

// CREATE BOARD
export const createBoard = async (
  name: string,
  ownerId: string
) => {
  const board = await Board.create({
    name: name.trim(),
    owner: new mongoose.Types.ObjectId(ownerId),
  });

  return board;
};

// GET ALL BOARDS
export const getBoards = async (ownerId: string) => {
  const boards = await Board.find({
    owner: ownerId,
  }).sort({ createdAt: -1 });

  return boards;
};

// GET SINGLE BOARD
export const getBoardById = async (
  boardId: string,
  ownerId: string
) => {
  const board = await Board.findOne({
    _id: boardId,
    owner: ownerId,
  });

  if (!board) {
    throw new Error("Board not found");
  }

  return board;
};

// CREATE TASK
export const createTask = async (
  boardId: string,
  ownerId: string,
  title: string,
  status: TaskStatus = "todo",
  order: number = 0
) => {
  const board = await Board.findOne({
    _id: boardId,
    owner: ownerId,
  });

  if (!board) {
    throw new Error("Board not found");
  }

  const task = await Task.create({
    title: title.trim(),
    status,
    boardId: board._id,
    order,
  });

  // Broadcast task creation
  getIO()
    .to(`board:${boardId}`)
    .emit("task:created", task);

  return task;
};

// UPDATE TASK
export const updateTask = async (
  taskId: string,
  ownerId: string,
  data: {
    title?: string;
    status?: TaskStatus;
    order?: number;
  }
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const board = await Board.findOne({
    _id: task.boardId,
    owner: ownerId,
  });

  if (!board) {
    throw new Error("Unauthorized");
  }

  const oldOrder = task.order;

  if (data.title !== undefined) {
    task.title = data.title.trim();
  }

  if (data.status !== undefined) {
    task.status = data.status;
  }

  if (data.order !== undefined) {
    task.order = data.order;
  }

  await task.save();

  const room = `board:${task.boardId.toString()}`;

  // If order changed → task moved
  if (
    data.order !== undefined &&
    data.order !== oldOrder
  ) {
    getIO()
      .to(room)
      .emit("task:moved", task);
  } else {
    // Normal update
    getIO()
      .to(room)
      .emit("task:updated", task);
  }

  return task;
};

// DELETE TASK
export const deleteTask = async (
  taskId: string,
  ownerId: string
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const board = await Board.findOne({
    _id: task.boardId,
    owner: ownerId,
  });

  if (!board) {
    throw new Error("Unauthorized");
  }

  const boardId = task.boardId.toString();

  await Task.findByIdAndDelete(taskId);

  // Broadcast task deletion
  getIO()
    .to(`board:${boardId}`)
    .emit("task:deleted", {
      taskId,
      boardId,
    });

  return {
    message: "Task deleted successfully",
  };
};

// GET TASKS FOR BOARD
export const getTasksByBoard = async (
  boardId: string,
  ownerId: string
) => {
  const board = await Board.findOne({
    _id: boardId,
    owner: ownerId,
  });

  if (!board) {
    throw new Error("Board not found");
  }

  const tasks = await Task.find({
    boardId: board._id,
  }).sort({
    order: 1,
    createdAt: 1,
  });

  return tasks;
};