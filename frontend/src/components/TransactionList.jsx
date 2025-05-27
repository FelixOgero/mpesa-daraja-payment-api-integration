import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTransactions } from '../services/api';
import '../styles/TransactionList.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response.data);
      } catch (error) {
        setError('Failed to fetch transactions');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="transaction-list-container">
      <h2>Transaction History</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : transactions.length > 0 ? (
        <div className="transaction-table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Phone Number</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className={`status-${transaction.status}`}>
                  <td>{transaction.reference}</td>
                  <td>{transaction.phoneNumber}</td>
                  <td>{transaction.amount} KES</td>
                  <td>
                    <span className={`status-badge ${transaction.status}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(transaction.createdAt)}</td>
                  <td>
                    <Link to={`/transactions/${transaction._id}`} className="view-button">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-transactions">No transactions found.</div>
      )}
    </div>
  );
};

export default TransactionList;