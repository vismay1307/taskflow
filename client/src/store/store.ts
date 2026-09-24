import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import boardReducer from "./slices/boardSlice";
import taskReducer from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
    tasks: taskReducer,
  },
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;