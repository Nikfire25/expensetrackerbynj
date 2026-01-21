import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transactionSlice";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("transactionsState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState); // This is TransactionState
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

const preloadedState = loadState() ? { transactions: loadState() } : undefined;

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState().transactions);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
