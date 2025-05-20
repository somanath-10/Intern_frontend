import React, { useState } from 'react';
import axios from 'axios';
import styles from './SetBudget.module.css';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

function SetBudget() {
  const [month, setMonth] = useState('');
  const [budgets, setBudgets] = useState({});

  const handleChange = (cat, value) => {
    setBudgets({ ...budgets, [cat]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    for (let cat of categories) {
      if (budgets[cat]) {
        await axios.post(`${process.env.REACT_APP_URL}/budgets`, {
          category: cat,
          amount: Number(budgets[cat]),
          month
        });
      }
    }
    alert('Budgets saved!');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input type="month" value={month} onChange={e => setMonth(e.target.value)} required />
      {categories.map(cat => (
        <div key={cat}>
          <label>{cat}</label>
          <input type="number" value={budgets[cat] || ''} onChange={e => handleChange(cat, e.target.value)} />
        </div>
      ))}
      <button type="submit">Set Budgets</button>
    </form>
  );
}

export default SetBudget;
