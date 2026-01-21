import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transactionSlice";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("transactionsState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("transactionsState", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
  preloadedState,
});

// ✅ Call store.getState() here
store.subscribe(() => saveState(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
