"use client";

import { useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from "@dnd-kit/core";

import { Task } from "@/types";

import { fetchBoard } from "@/store/slices/boardSlice";

import {
  fetchTasks,
  updateTask,
  updateTaskLocally,
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskMoved,
  socketTaskDeleted,
} from "@/store/slices/taskSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import { socket } from "@/lib/socket";

import AddTaskForm from "./AddTaskForm";
import KanbanColumn from "./KanbanColumn";

interface BoardViewProps {
  boardId: string;
}

export default function BoardView({
  boardId,
}: BoardViewProps) {
  const dispatch = useAppDispatch();

  // =========================
  // BOARD STATE
  // =========================

  const { currentBoard } = useAppSelector(
    (state) => state.boards
  );

  // =========================
  // TASK STATE
  // =========================

  const { tasks, loading } = useAppSelector(
    (state) => state.tasks
  );

  // ==================================================
  // INITIAL DATA
  // ==================================================

  useEffect(() => {
    dispatch(fetchBoard(boardId));
    dispatch(fetchTasks(boardId));
  }, [dispatch, boardId]);

  // ==================================================
  // SOCKET.IO
  // ==================================================

  useEffect(() => {
    // -------------------------
    // Connect socket
    // -------------------------

    socket.connect();

    // -------------------------
    // Join board room
    // -------------------------

    socket.emit("join-board", boardId);

    console.log(
      `Joined board room: ${boardId}`
    );

    // ==================================================
    // SOCKET EVENT HANDLERS
    // ==================================================

    // -------------------------
    // TASK CREATED
    // -------------------------

    const handleTaskCreated = (
      task: Task
    ) => {
      console.log(
        "Socket: task:created",
        task
      );

      dispatch(
        socketTaskCreated(task)
      );
    };

    // -------------------------
    // TASK UPDATED
    // -------------------------

    const handleTaskUpdated = (
      task: Task
    ) => {
      console.log(
        "Socket: task:updated",
        task
      );

      dispatch(
        socketTaskUpdated(task)
      );
    };

    // -------------------------
    // TASK MOVED
    // -------------------------

    const handleTaskMoved = (
      task: Task
    ) => {
      console.log(
        "Socket: task:moved",
        task
      );

      dispatch(
        socketTaskMoved(task)
      );
    };

    // -------------------------
    // TASK DELETED
    // -------------------------

    const handleTaskDeleted = (
      taskId: string
    ) => {
      console.log(
        "Socket: task:deleted",
        taskId
      );

      dispatch(
        socketTaskDeleted(taskId)
      );
    };

    // ==================================================
    // REGISTER LISTENERS
    // ==================================================

    socket.on(
      "task:created",
      handleTaskCreated
    );

    socket.on(
      "task:updated",
      handleTaskUpdated
    );

    socket.on(
      "task:moved",
      handleTaskMoved
    );

    socket.on(
      "task:deleted",
      handleTaskDeleted
    );

    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {
      socket.off(
        "task:created",
        handleTaskCreated
      );

      socket.off(
        "task:updated",
        handleTaskUpdated
      );

      socket.off(
        "task:moved",
        handleTaskMoved
      );

      socket.off(
        "task:deleted",
        handleTaskDeleted
      );

      socket.disconnect();
    };
  }, [dispatch, boardId]);

  // ==================================================
  // FILTER TASKS
  // ==================================================

  const todoTasks = tasks
    .filter(
      (task) => task.status === "todo"
    )
    .sort(
      (a, b) => a.order - b.order
    );

  const inProgressTasks = tasks
    .filter(
      (task) =>
        task.status === "in-progress"
    )
    .sort(
      (a, b) => a.order - b.order
    );

  const doneTasks = tasks
    .filter(
      (task) => task.status === "done"
    )
    .sort(
      (a, b) => a.order - b.order
    );

  // ==================================================
  // DRAG & DROP
  // ==================================================

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    // Nothing was dropped
    if (!over) return;

    const taskId = String(active.id);

    // Find dragged task
    const task = tasks.find(
      (item) => item._id === taskId
    );

    if (!task) return;

    // Destination column
    const newStatus = String(over.id) as
      | "todo"
      | "in-progress"
      | "done";

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    // Invalid destination
    if (
      !validStatuses.includes(newStatus)
    ) {
      return;
    }

    // Same column
    if (task.status === newStatus) {
      return;
    }

    // Generate order
    const newOrder = Date.now();

    // ==================================================
    // UPDATE UI IMMEDIATELY
    // ==================================================

    dispatch(
      updateTaskLocally({
        taskId,
        status: newStatus,
        order: newOrder,
      })
    );

    // ==================================================
    // UPDATE BACKEND
    // ==================================================

    dispatch(
      updateTask({
        taskId,
        status: newStatus,
        order: newOrder,
      })
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (
    loading &&
    !currentBoard
  ) {
    return (
      <div className="p-8">
        Loading board...
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              {currentBoard?.name ||
                "TaskFlow Board"}
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your tasks
            </p>
          </div>

          <AddTaskForm
            boardId={boardId}
          />

        </div>

        {/* =========================
            KANBAN BOARD
        ========================= */}

        <DndContext
          collisionDetection={
            closestCorners
          }
          onDragEnd={
            handleDragEnd
          }
        >

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* =========================
                TODO
            ========================= */}

            <KanbanColumn
              id="todo"
              title="To Do"
              tasks={todoTasks}
            />

            {/* =========================
                IN PROGRESS
            ========================= */}

            <KanbanColumn
              id="in-progress"
              title="In Progress"
              tasks={inProgressTasks}
            />

            {/* =========================
                DONE
            ========================= */}

            <KanbanColumn
              id="done"
              title="Done"
              tasks={doneTasks}
            />

          </div>

        </DndContext>

      </div>
    </main>
  );
}