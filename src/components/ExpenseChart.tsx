import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { store } from "../store/store";
import type { RootState } from "../store/store";

ChartJS.register(ArcElement, Legend, Tooltip);

const ExpenseChart = () => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions,
  );

  const expenseMap: Record<string, number> = {};

  transactions
    .filter((trx) => trx.isExpense)
    .forEach((tx) => {
      expenseMap[tx.title] = (expenseMap[tx.title] || 0) + tx.amount;
    });

  const data = {
    labels: Object.keys(expenseMap),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(expenseMap),
        backgroundColor: [
          "#dc3545",
          "#fd7e14",
          "#ffc107",
          "#198754",
          "#0d6efd",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (Object.keys(expenseMap).length === 0) {
    return <p className="text-center text-muted">No Expense to show</p>;
  }
  return (
    <div className="card p-3 shadow-sm">
      <h5 className="text-center mb-3">Expense Distribution</h5>
      <Doughnut data={data} />
    </div>
  );
};

export default ExpenseChart;
