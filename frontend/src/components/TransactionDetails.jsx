import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTransactionById } from '../services/api';
import '../styles/TransactionDetails.css';

const TransactionDetails = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await getTransactionById(id);
        setTransaction(response.data);
      } catch (error) {
        setError('Failed to fetch transaction details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }

    // Poll for updates every 5 seconds if the transaction is pending
    const intervalId = setInterval(async () => {
      if (transaction && transaction.status === 'pending') {
        try {
          const response = await getTransactionById(id);
          setTransaction(response.data);
          // Stop polling if the transaction is no longer pending
          if (response.data.status !== 'pending') {
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [id, transaction?.status]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading transaction details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!transaction) {
    return <div className="not-found">Transaction not found</div>;
  }

  return (
    <div className="transaction-details-container">
      <h2>Transaction Details</h2>
      
      <div className="transaction-status">
        <div className={`status-badge large ${transaction.status}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </div>
        
        {transaction.status === 'pending' && (
          <div className="pending-message">
            <p>Please complete the payment on your phone.</p>
            <div className="loader"></div>
          </div>
        )}
      </div>

      <div className="details-card">
        <div className="detail-row">
          <span className="detail-label">Reference:</span>
          <span className="detail-value">{transaction.reference}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Phone Number:</span>
          <span className="detail-value">{transaction.phoneNumber}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Amount:</span>
          <span className="detail-value">{transaction.amount} KES</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Description:</span>
          <span className="detail-value">{transaction.description}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Created At:</span>
          <span className="detail-value">{formatDate(transaction.createdAt)}</span>
        </div>
        
        {transaction.mpesaReceiptNumber && (
          <div className="detail-row">
            <span className="detail-label">M-PESA Receipt:</span>
            <span className="detail-value">{transaction.mpesaReceiptNumber}</span>
          </div>
        )}
        
        {transaction.transactionDate && (
          <div className="detail-row">
            <span className="detail-label">Transaction Date:</span>
            <span className="detail-value">{formatDate(transaction.transactionDate)}</span>
          </div>
        )}
        
        {transaction.responseDescription && (
          <div className="detail-row">
            <span className="detail-label">Response:</span>
            <span className="detail-value">{transaction.responseDescription}</span>
          </div>
        )}
      </div>
      
      <div className="actions">
        <Link to="/transactions" className="back-button">Back to Transactions</Link>
        <Link to="/" className="pay-button">Make Another Payment</Link>
      </div>
    </div>
  );
};

export default TransactionDetails;