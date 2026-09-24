"use client";

import { useDroppable } from "@dnd-kit/core";

import { Task } from "@/types";

import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  id: Task["status"];
  title: string;
  tasks: Task[];
}

export default function KanbanColumn({
  id,
  title,
  tasks,
}: KanbanColumnProps) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[500px] rounded-2xl p-4 transition ${
        isOver
          ? "bg-gray-200"
          : "bg-gray-100"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          {title}
        </h2>

        <span className="rounded-full bg-white px-3 py-1 text-xs">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}