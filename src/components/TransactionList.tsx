import { useDispatch, useSelector } from "react-redux";
import {
  deleteTransaction,
  calculateBalance,
  calculateExpense,
  calculateIncome,
} from "../store/transactionSlice";
import type { Transaction } from "../store/transactionSlice";
import type { AppDispatch, RootState } from "../store/store";

interface Props {
  onEdit: (t: Transaction) => void;
}

const TransactionList = ({ onEdit }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions,
  );

  const handleDelete = (id: string) => {
    dispatch(deleteTransaction(id));
    dispatch(calculateBalance());
    dispatch(calculateIncome());
    dispatch(calculateExpense());
  };

  // ✅ Only take the top 5 transactions
  const topTransactions = transactions.slice(0, 5);

  return (
    <div className="transaction-scroll-wrapper">
      <ul className="list-group">
        {topTransactions.map((t) => (
          <li
            key={t.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              t.isExpense ? "list-group-item-danger" : "list-group-item-success"
            }`}
          >
            {t.title}
            <span>
              ₹{t.amount}
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
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
