import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import BalanceSummary from "./Balance";
import ExpenseChart from "./ExpenseChart";
import ExpenseBarChart from "./ExpenseBarChart";
import { logout } from "../store/authSlice";
import { toast } from "react-toastify";
import {
  fetchTransactions,
  clearTransactionsOnLogout,
} from "../store/transactionSlice";
import type { AppDispatch, RootState } from "../store/store";
import type { Transaction } from "../store/transactionSlice";

const TransactionsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions());
    }
  }, [user, dispatch]);

  const getNameFromEmail = (email: string) =>
    email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTransactionsOnLogout());
    toast.info("User logged out");

    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* CENTERED HEADER */}
      <h1 className="text-center mb-2">Expense Tracker</h1>

      {/* USER INFO BELOW */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Hi {user && getNameFromEmail(user.email)}</h4>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="app-grid">
        <div className="left-col">
          <BalanceSummary />
          <TransactionForm
            editingTransaction={editingTransaction}
            clearEdit={() => setEditingTransaction(null)}
          />
          <TransactionList onEdit={setEditingTransaction} />
        </div>

        <div className="right-col justify-content-center">
          <ExpenseChart />
          <ExpenseBarChart />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
