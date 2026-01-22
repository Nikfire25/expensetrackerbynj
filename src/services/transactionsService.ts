// src/services/transactionsService.ts
import axios from "axios";
import type {
  Transaction,
  TransactionPayload,
} from "../store/transactionSlice";

const API_URL = "https://expensetrackerbynjbackend.onrender.com/transactions"; // your JSON server endpoint

export const transactionsService = {
  getTransactions: async (token: string) => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Transaction[];
  },

  addTransaction: async (transaction: TransactionPayload, token: string) => {
    const res = await axios.post(API_URL, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Transaction;
  },

  updateTransaction: async (transaction: Transaction, token: string) => {
    const res = await axios.put(`${API_URL}/${transaction.id}`, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Transaction;
  },

  deleteTransaction: async (id: string, token: string) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  },
};
