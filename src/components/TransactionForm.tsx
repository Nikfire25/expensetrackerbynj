import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  // createTransaction,
  updateTransactionAPI,
  createTransactionAPI,
  calculateBalance,
} from "../store/transactionSlice";
import type { Transaction } from "../store/transactionSlice";
import { PencilSquare, PlusCircle, Eye, EyeSlash } from "react-bootstrap-icons";

interface Props {
  editingTransaction: Transaction | null;
  clearEdit: () => void;
}

const TransactionForm = ({ editingTransaction, clearEdit }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [show, setShow] = useState(
    JSON.parse(localStorage.getItem("show") ?? "true"),
  );
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isExpense, setIsExpense] = useState(true);

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setIsExpense(editingTransaction.isExpense);
      setShow(true);
    } else {
      setTitle("");
      setAmount("");
      setIsExpense(true);
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const numAmount = Number(amount);
    if (!title || isNaN(numAmount) || numAmount <= 0) return;

    if (editingTransaction) {
      await dispatch(
        updateTransactionAPI({
          id: editingTransaction.id,
          title,
          amount: numAmount,
          isExpense,
          userEmail: user.email,
        }),
      );
      clearEdit();
    } else {
      await dispatch(
        createTransactionAPI({
          title,
          amount: numAmount,
          isExpense,
          userEmail: user.email,
        }),
      );
    }

    dispatch(calculateBalance());

    setTitle("");
    setAmount("");
    setIsExpense(true);
  };

  const toggleShow = () => {
    const newShow = !show;
    setShow(newShow);
    localStorage.setItem("show", JSON.stringify(newShow));
  };

  return (
    <div className="mb-2 position-relative" style={{ width: "100%" }}>
      <div className="d-flex justify-content-end mb-1">
        <button
          className="btn btn-outline-primary"
          onClick={toggleShow}
          style={{ width: "40px", height: "40px", padding: 0 }}
          title={show ? "Hide Form" : "Show Form"}
        >
          {show ? <EyeSlash /> : <Eye />}
        </button>
      </div>

      <div
        style={{
          transition: "all 0.3s ease",
          maxHeight: show ? "1000px" : "0px",
          overflow: "hidden",
        }}
      >
        {show && (
          <form
            className="card p-4 shadow-sm"
            onSubmit={handleSubmit}
            style={{ minWidth: "350px" }}
          >
            <h5 className="card-title mb-3 d-flex align-items-center">
              {editingTransaction ? (
                <>
                  <PencilSquare className="me-2 text-warning" /> Edit
                  Transaction
                </>
              ) : (
                <>
                  <PlusCircle className="me-2 text-success" /> Add Transaction
                </>
              )}
            </h5>

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isExpense}
                onChange={(e) => setIsExpense(e.target.checked)}
                id="isExpenseCheck"
              />
              <label className="form-check-label" htmlFor="isExpenseCheck">
                Is Expense
              </label>
            </div>

            <button className="btn btn-primary w-100">
              {editingTransaction ? "Update Transaction" : "Add Transaction"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
