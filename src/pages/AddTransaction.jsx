import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddTransaction.module.css';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

function AddTransaction() {
  const [form, setForm] = useState({ amount: '', description: '', date: '', category: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_URL}/transactions`, form);
    alert('Transaction added!');
    setForm({ amount: '', description: '', date: '', category: '' });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default AddTransaction;