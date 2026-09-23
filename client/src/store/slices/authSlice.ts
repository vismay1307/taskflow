import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

import api from "@/lib/axios";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signupMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  signupMessage: null,
};

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signup",

  async (
    data: {
      firstName: string;
      lastName?: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/auth/signup",
        data
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Signup failed"
        );
      }

      return rejectWithValue("Signup failed");
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",

  async (
    data: {
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/auth/login",
        data
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Login failed"
        );
      }

      return rejectWithValue("Login failed");
    }
  }
);

// GET CURRENT USER
export const getMe = createAsyncThunk(
  "auth/getMe",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to get user"
        );
      }

      return rejectWithValue(
        "Failed to get user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    clearSignupMessage: (state) => {
      state.signupMessage = null;
    },
  },

  extraReducers: (builder) => {
    // SIGNUP
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupMessage = null;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.signupMessage =
          action.payload.message;
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload as string;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload.user;
        state.token = action.payload.token;

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "token",
            action.payload.token
          );
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload as string;
      });

    // GET ME
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload as string;
      });
  },
});

export const {
  logout,
  clearAuthError,
  clearSignupMessage,
} = authSlice.actions;

export default authSlice.reducer;