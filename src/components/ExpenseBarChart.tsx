import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ExpenseBarChart = () => {
  const income = useSelector((state) => state.transactions.income);
  const expense = useSelector((state) => state.transactions.expense);
  const data = {
    labels: ["income", "expense"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#28a745", "#dc3545"],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  if (income === 0 && expense === 0) {
    return <p className="text-center text-muted">No Income or Expense yet</p>;
  }
  return (
    <div className="card p-3">
      <h5 className="text-center mb-3">Income vs Expenses</h5>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseBarChart;
