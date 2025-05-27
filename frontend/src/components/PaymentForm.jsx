import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiatePayment } from '../services/api';
import '../styles/PaymentForm.css';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '',
    reference: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate phone number
      if (!formData.phoneNumber.match(/^(07|\+?254|0|\+?1)[0-9]{8,9}$/)) {
        throw new Error('Please enter a valid Kenyan phone number');
      }

      // Validate amount
      if (parseFloat(formData.amount) < 1) {
        throw new Error('Amount must be at least 1 KES');
      }

      const response = await initiatePayment({
        phoneNumber: formData.phoneNumber,
        amount: formData.amount,
        reference: formData.reference || 'Payment',
        description: formData.description || 'Payment for services'
      });

      setSuccess('Payment initiated! Check your phone to complete the transaction.');
      
      // Navigate to transaction details after 3 seconds
      setTimeout(() => {
        navigate(`/transactions/${response.transactionId}`);
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-container">
      <h2>M-PESA Payment</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="e.g., 0712345678 or +254712345678"
            required
          />
          <small>Format: 07XXXXXXXX or +2547XXXXXXXX</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount (KES)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount in KES"
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reference">Reference</label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Payment reference"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Payment description"
            rows="3"
          ></textarea>
        </div>
        
        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? 'Processing...' : 'Pay with M-PESA'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;