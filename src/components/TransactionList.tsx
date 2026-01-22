import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteTransactionAPI,
  calculateBalance,
} from "../store/transactionSlice";
import type { Transaction } from "../store/transactionSlice";
import type { AppDispatch, RootState } from "../store/store";

interface Props {
  onEdit: (t: Transaction) => void;
}

const TransactionList = ({ onEdit }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const transactions = useSelector((state: RootState) => {
    const email = state.auth.user?.email;
    return state.transactions.transactions.filter(
      (tx) => tx.userEmail === email,
    );
  });

  // 🔥 auto recalc balance
  useEffect(() => {
    dispatch(calculateBalance());
  }, [transactions.length, dispatch]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    await dispatch(deleteTransactionAPI(id));
  };

  return (
    <div className="transaction-scroll-wrapper">
      <ul className="list-group">
        {transactions.length === 0 ? (
          <li className="list-group-item text-center text-muted">
            No transactions yet
          </li>
        ) : (
          transactions.map((t) => (
            <li
              key={t.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                t.isExpense
                  ? "list-group-item-danger"
                  : "list-group-item-success"
              }`}
            >
              {t.title}
              <span>
                ₹{t.amount.toLocaleString()}
                <button
                  className="btn btn-sm btn-outline-primary ms-2"
                  onClick={() => onEdit(t)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-dark ms-2"
                  onClick={() => handleDelete(t.id)}
                >
                  X
                </button>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
