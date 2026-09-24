"use client";

import {
  FormEvent,
  useState,
} from "react";

import { createTask } from "@/store/slices/taskSlice";
import { useAppDispatch } from "@/store/hooks";

interface AddTaskFormProps {
  boardId: string;
}

export default function AddTaskForm({
  boardId,
}: AddTaskFormProps) {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) return;

    await dispatch(
      createTask({
        boardId,
        title: title.trim(),
        status: "todo",
        order: Date.now(),
      })
    );

    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        + Add Task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        placeholder="Task title..."
        className="rounded-lg border px-4 py-2"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Add
      </button>

      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setTitle("");
        }}
        className="rounded-lg border px-4 py-2"
      >
        Cancel
      </button>
    </form>
  );
}