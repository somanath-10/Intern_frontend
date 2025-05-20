import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      console.log("react",process.env.REACT_APP_URL)
      const res = await axios.get(`${process.env.REACT_APP_URL}/transactions`);
      setTransactions(res.data);
    };

    const fetchBudgets = async () => {
      const res = await axios.get(`${process.env.REACT_APP_URL}/budgets/${month}`);
      setBudgets(res.data);
    };

    fetchTransactions();
    fetchBudgets();
  }, [month]);

  // Filter transactions for selected month
  const filteredTransactions = transactions.filter(txn =>
    txn.date.startsWith(month)
  );

  const totalExpenses = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const categoryTotals = filteredTransactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const budgetChartData = budgets.map(budget => {
    const actual = categoryTotals[budget.category] || 0;
    return {
      category: budget.category,
      budget: budget.amount,
      actual,
    };
  });

  return (
<div className={styles.container}>
  <h1>Dashboard</h1>

  <div className={styles.monthSelector}>
    <label>Select Month: </label>
    <input
      type="month"
      value={month}
      onChange={e => setMonth(e.target.value)}
    />
  </div>

  <div className={styles.summaryCards}>
    <div className={styles.card}>
      <h3>Total Expenses</h3>
      <p>₹ {totalExpenses.toFixed(2)}</p>
    </div>

    <div className={`${styles.card} ${styles.recentTransactions}`}>
      <h3>Most Recent Transactions</h3>
      <ul>
        {recentTransactions.map(txn => (
          <li key={txn._id}>
            {txn.date}: {txn.category} - ₹{txn.amount}
          </li>
        ))}
      </ul>
    </div>
  </div>
  <div className={styles.chartsWrapper}>
    <div className={styles.chartContainer}>
  <h3>Category-wise Expenses</h3>
  {pieData.length > 0 ? (
    <PieChart width={300} height={300}>
<Pie
  data={pieData}
  cx="50%"
  cy="50%"
  labelLine={false}
  label={({ payload, percent }) => `${payload.name} ${(percent * 100).toFixed(0)}%`}
  outerRadius={100}
  fill="#8884d8"
  dataKey="value"
>
  {pieData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie>

    </PieChart>
  ) : (
    <p>No expense data available for selected month.</p>
  )}
</div>
<div className={styles.chartContainer}>
<h3>Budget vs Actual</h3>
          <BarChart
            width={500}
            height={300}
            data={budgetChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
            <Bar dataKey="actual" fill="#8884d8" name="Actual" />
          </BarChart>
        </div>
      </div>

      <div className={styles.linksContainer}>
    <Link to="/add">+ Add Transaction</Link> | <Link to="/budget">+ Set Budget</Link>
  </div>
    </div>
  );
};

export default Dashboard;
