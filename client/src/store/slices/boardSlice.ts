import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

import api from "@/lib/axios";
import { Board } from "@/types";

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

// GET ALL BOARDS
export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/boards");

      return response.data.boards;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch boards"
        );
      }

      return rejectWithValue(
        "Failed to fetch boards"
      );
    }
  }
);

// GET SINGLE BOARD
export const fetchBoard = createAsyncThunk(
  "boards/fetchBoard",

  async (
    boardId: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/boards/${boardId}`
      );

      return response.data.board;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch board"
        );
      }

      return rejectWithValue(
        "Failed to fetch board"
      );
    }
  }
);

// CREATE BOARD
export const createBoard = createAsyncThunk(
  "boards/createBoard",

  async (
    name: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/boards",
        { name }
      );

      return response.data.board;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create board"
        );
      }

      return rejectWithValue(
        "Failed to create board"
      );
    }
  }
);

const boardSlice = createSlice({
  name: "boards",

  initialState,

  reducers: {
    clearBoardError: (state) => {
      state.error = null;
    },

    clearCurrentBoard: (state) => {
      state.currentBoard = null;
    },
  },

  extraReducers: (builder) => {
    // FETCH BOARDS
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })

      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload as string;
      });

    // FETCH SINGLE BOARD
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload;
      })

      .addCase(fetchBoard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload as string;
      });

    // CREATE BOARD
    builder
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;

        state.boards.unshift(action.payload);
      })

      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload as string;
      });
  },
});

export const {
  clearBoardError,
  clearCurrentBoard,
} = boardSlice.actions;

export default boardSlice.reducer;