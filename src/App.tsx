import { useState } from "react";
import "./App.css";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import BalanceSummary from "./components/Balance";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseBarChart from "./components/ExpenseBarChart";
import type { Transaction } from "./store/transactionSlice";

function App() {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  return (
    <div className="app-container">
      <h1 className="app-title">Expense Tracker</h1>

      <div className="app-grid">
        {/* LEFT COLUMN */}
        <div className="left-col">
          <BalanceSummary />
          <TransactionForm
            editingTransaction={editingTransaction}
            clearEdit={() => setEditingTransaction(null)}
          />
          <TransactionList onEdit={setEditingTransaction} />
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="right-col"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <ExpenseChart />
          <ExpenseBarChart />
        </div>
      </div>
    </div>
  );
}

export default App;
