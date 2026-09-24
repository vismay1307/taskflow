import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import axios from "axios";
import api from "@/lib/axios";
import { Task } from "@/types";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// =========================
// FETCH TASKS
// =========================

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (boardId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/boards/${boardId}/tasks`);

      return response.data.tasks;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch tasks"
        );
      }

      return rejectWithValue("Failed to fetch tasks");
    }
  }
);

// =========================
// CREATE TASK
// =========================

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    data: {
      boardId: string;
      title: string;
      status?: Task["status"];
      order?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/boards/${data.boardId}/tasks`,
        {
          title: data.title,
          status: data.status || "todo",
          order: data.order || 0,
        }
      );

      return response.data.task;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create task"
        );
      }

      return rejectWithValue("Failed to create task");
    }
  }
);

// =========================
// UPDATE TASK
// =========================

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    data: {
      taskId: string;
      title?: string;
      status?: Task["status"];
      order?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/tasks/${data.taskId}`,
        {
          title: data.title,
          status: data.status,
          order: data.order,
        }
      );

      return response.data.task;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update task"
        );
      }

      return rejectWithValue("Failed to update task");
    }
  }
);

// =========================
// DELETE TASK
// =========================

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (
    taskId: string,
    { rejectWithValue }
  ) => {
    try {
      await api.delete(`/tasks/${taskId}`);

      return taskId;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete task"
        );
      }

      return rejectWithValue("Failed to delete task");
    }
  }
);

// =========================
// SLICE
// =========================

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    // -------------------------
    // Clear error
    // -------------------------

    clearTaskError: (state) => {
      state.error = null;
    },

    // -------------------------
    // Local drag & drop update
    // -------------------------

    updateTaskLocally: (
      state,
      action: PayloadAction<{
        taskId: string;
        status: Task["status"];
        order: number;
      }>
    ) => {
      const task = state.tasks.find(
        (task) =>
          task._id === action.payload.taskId
      );

      if (!task) return;

      task.status = action.payload.status;
      task.order = action.payload.order;
    },

    // ==================================================
    // SOCKET EVENTS
    // ==================================================

    // -------------------------
    // task:created
    // -------------------------

    socketTaskCreated: (
      state,
      action: PayloadAction<Task>
    ) => {
      const exists = state.tasks.some(
        (task) =>
          task._id === action.payload._id
      );

      if (!exists) {
        state.tasks.push(action.payload);
      }
    },

    // -------------------------
    // task:updated
    // -------------------------

    socketTaskUpdated: (
      state,
      action: PayloadAction<Task>
    ) => {
      const index = state.tasks.findIndex(
        (task) =>
          task._id === action.payload._id
      );

      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },

    // -------------------------
    // task:moved
    // -------------------------

    socketTaskMoved: (
      state,
      action: PayloadAction<Task>
    ) => {
      const index = state.tasks.findIndex(
        (task) =>
          task._id === action.payload._id
      );

      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },

    // -------------------------
    // task:deleted
    // -------------------------

    socketTaskDeleted: (
      state,
      action: PayloadAction<string>
    ) => {
      state.tasks = state.tasks.filter(
        (task) =>
          task._id !== action.payload
      );
    },
  },

  // ==================================================
  // ASYNC THUNKS
  // ==================================================

  extraReducers: (builder) => {
    // =========================
    // FETCH TASKS
    // =========================

    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchTasks.fulfilled,
        (state, action) => {
          state.loading = false;
          state.tasks = action.payload;
        }
      )

      .addCase(
        fetchTasks.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // CREATE TASK
    // =========================

    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        createTask.fulfilled,
        (state, action) => {
          state.loading = false;

          const exists = state.tasks.some(
            (task) =>
              task._id === action.payload._id
          );

          if (!exists) {
            state.tasks.push(action.payload);
          }
        }
      )

      .addCase(
        createTask.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // UPDATE TASK
    // =========================

    builder
      .addCase(
        updateTask.fulfilled,
        (state, action) => {
          const index =
            state.tasks.findIndex(
              (task) =>
                task._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.tasks[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateTask.rejected,
        (state, action) => {
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // DELETE TASK
    // =========================

    builder
      .addCase(
        deleteTask.fulfilled,
        (state, action) => {
          state.tasks =
            state.tasks.filter(
              (task) =>
                task._id !== action.payload
            );
        }
      )

      .addCase(
        deleteTask.rejected,
        (state, action) => {
          state.error =
            action.payload as string;
        }
      );
  },
});

// ==================================================
// EXPORT ACTIONS
// ==================================================

export const {
  clearTaskError,
  updateTaskLocally,
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskMoved,
  socketTaskDeleted,
} = taskSlice.actions;

// ==================================================
// EXPORT REDUCER
// ==================================================

export default taskSlice.reducer;