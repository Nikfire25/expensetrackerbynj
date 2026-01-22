import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { transactionsService } from "../services/transactionsService";
import type { RootState } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";

// Interfaces
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  isExpense: boolean;
  userEmail: string;
}

export interface TransactionPayload {
  title: string;
  amount: number;
  isExpense: boolean;
  userEmail: string;
}

// State
interface TransactionState {
  transactions: Transaction[];
  balance: number;
  income: number;
  expense: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  balance: 0,
  income: 0,
  expense: 0,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchTransactions = createAsyncThunk<
  Transaction[],
  void,
  { state: RootState }
>("transactions/fetch", async (_, thunkAPI) => {
  try {
    const email = thunkAPI.getState().auth.user?.email;
    const token = thunkAPI.getState().auth.token!;
    const allTransactions = await transactionsService.getTransactions(token);
    return allTransactions.filter((tx) => tx.userEmail === email);
  } catch {
    return thunkAPI.rejectWithValue("Failed to fetch transactions");
  }
});

export const createTransactionAPI = createAsyncThunk<
  Transaction,
  TransactionPayload,
  { state: RootState }
>("transactions/create", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token!;
    return await transactionsService.addTransaction(payload, token);
  } catch {
    return thunkAPI.rejectWithValue("Failed to create transaction");
  }
});

export const updateTransactionAPI = createAsyncThunk<
  Transaction,
  Transaction,
  { state: RootState }
>("transactions/update", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token!;
    return await transactionsService.updateTransaction(payload, token);
  } catch {
    return thunkAPI.rejectWithValue("Failed to update transaction");
  }
});

export const deleteTransactionAPI = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("transactions/delete", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token!;
    await transactionsService.deleteTransaction(id, token);
    return id;
  } catch {
    return thunkAPI.rejectWithValue("Failed to delete transaction");
  }
});

// Helper to calculate balance
const calculateTotals = (state: TransactionState) => {
  state.balance = 0;
  state.income = 0;
  state.expense = 0;

  state.transactions.forEach((tx) => {
    if (tx.isExpense) {
      state.balance -= tx.amount;
      state.expense += tx.amount;
    } else {
      state.balance += tx.amount;
      state.income += tx.amount;
    }
  });
};

// Slice
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    calculateBalance: (state) => {
      calculateTotals(state);
    },
    clearTransactionsOnLogout: (state) => {
      state.transactions = [];
      state.balance = 0;
      state.income = 0;
      state.expense = 0;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.isLoading = false;
          state.transactions = action.payload;
          calculateTotals(state);
        },
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createTransactionAPI.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        calculateTotals(state);
      })

      .addCase(updateTransactionAPI.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (tx) => tx.id === action.payload.id,
        );
        if (index !== -1) state.transactions[index] = action.payload;
        calculateTotals(state);
      })

      .addCase(deleteTransactionAPI.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (tx) => tx.id !== action.payload,
        );
        calculateTotals(state);
      });
  },
});

export const { calculateBalance, clearTransactionsOnLogout } =
  transactionSlice.actions;
export default transactionSlice.reducer;
