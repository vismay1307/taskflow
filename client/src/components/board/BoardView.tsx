"use client";

import { useEffect } from "react";

import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from "@dnd-kit/core";

import { fetchBoard } from "@/store/slices/boardSlice";

import {
  fetchTasks,
  updateTask,
  updateTaskLocally,
} from "@/store/slices/taskSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import AddTaskForm from "./AddTaskForm";
import KanbanColumn from "./KanbanColumn";

interface BoardViewProps {
  boardId: string;
}

export default function BoardView({
  boardId,
}: BoardViewProps) {
  const dispatch = useAppDispatch();

  const { currentBoard } = useAppSelector(
    (state) => state.boards
  );

  const { tasks, loading } =
    useAppSelector(
      (state) => state.tasks
    );

  useEffect(() => {
    dispatch(fetchBoard(boardId));
    dispatch(fetchTasks(boardId));
  }, [dispatch, boardId]);

  const todoTasks = tasks
    .filter(
      (task) => task.status === "todo"
    )
    .sort((a, b) => a.order - b.order);

  const inProgressTasks = tasks
    .filter(
      (task) =>
        task.status === "in-progress"
    )
    .sort((a, b) => a.order - b.order);

  const doneTasks = tasks
    .filter(
      (task) => task.status === "done"
    )
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);

    const task = tasks.find(
      (item) => item._id === taskId
    );

    if (!task) return;

    const newStatus = String(over.id) as
      | "todo"
      | "in-progress"
      | "done";

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    if (
      !validStatuses.includes(newStatus)
    ) {
      return;
    }

    if (task.status === newStatus) {
      return;
    }

    const newOrder = Date.now();

    // Update UI immediately
    dispatch(
      updateTaskLocally({
        taskId,
        status: newStatus,
        order: newOrder,
      })
    );

    // Save change in backend
    dispatch(
      updateTask({
        taskId,
        status: newStatus,
        order: newOrder,
      })
    );
  };

  if (loading && !currentBoard) {
    return (
      <div className="p-8">
        Loading board...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
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

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <KanbanColumn
              id="todo"
              title="To Do"
              tasks={todoTasks}
            />

            <KanbanColumn
              id="in-progress"
              title="In Progress"
              tasks={inProgressTasks}
            />

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