import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  isExpense: boolean;
}

interface TransactionState {
  balance: number;
  income: number;
  expense: number;
  transactions: Transaction[];
}

export interface TransactionPayload {
  title: string;
  amount: number;
  isExpense: boolean;
}

/* =======================
   Initial State
======================= */

const initState: TransactionState = {
  balance: 0,
  expense: 0,
  income: 0,
  transactions: [],
};

/* =======================
   Slice
======================= */

export const transactionsSlice = createSlice({
  name: "transaction",
  initialState: initState,
  reducers: {
    addTransaction: (state, action: PayloadAction<TransactionPayload>) => {
      const amount = Number(action.payload.amount);

      if (!isNaN(amount) && amount > 0) {
        state.transactions.push({
          id: crypto.randomUUID(),
          title: action.payload.title,
          amount,
          isExpense: action.payload.isExpense,
        });
      }
    },

    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id,
      );

      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (tx) => tx.id !== action.payload,
      );
    },

    calculateBalance: (state) => {
      state.balance = state.transactions.reduce(
        (acc, tx) => acc + (tx.isExpense ? -tx.amount : tx.amount),
        0,
      );
    },

    calculateIncome: (state) => {
      state.income = state.transactions.reduce(
        (acc, tx) => (!tx.isExpense ? acc + tx.amount : acc),
        0,
      );
    },

    calculateExpense: (state) => {
      state.expense = state.transactions.reduce(
        (acc, tx) => (tx.isExpense ? acc + tx.amount : acc),
        0,
      );
    },
  },
});

/* =======================
   Exports
======================= */

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  calculateBalance,
  calculateExpense,
  calculateIncome,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
