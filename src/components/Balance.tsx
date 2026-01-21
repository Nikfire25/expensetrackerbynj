import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const BalanceSummary = () => {
  const { balance, income, expense } = useSelector(
    (state: RootState) => state.transactions,
  );

  return (
    <div className="card p-3 mb-2 text-center">
      <h4 className="fw-bold">
        Balance:{" "}
        <span
          className={
            balance < 0
              ? "text-danger"
              : balance > 0
                ? "text-success"
                : "text-secondary"
          }
        >
          ₹{balance}
        </span>
      </h4>
      <div className="d-flex justify-content-between">
        <span className="text-success">Income: ₹{income}</span>
        <span className="text-danger">Expense: ₹{expense}</span>
      </div>
    </div>
  );
};

export default BalanceSummary;
