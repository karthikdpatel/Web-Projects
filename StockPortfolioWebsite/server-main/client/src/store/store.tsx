import itemsSlice from "./items-slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: { itemsData: itemsSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
