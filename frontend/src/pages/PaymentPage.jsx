import React, { useState } from 'react';
import { initiatePayment } from '../services/mpesaService';
import './PaymentPage.css';

function PaymentPage() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate phone number (Kenyan phone number format)
    const phoneRegex = /^(07|01)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    // Validate amount
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      const response = await initiatePayment(phone, amount);
      setSuccess('Payment request sent successfully. Check your phone.');
      console.log('Payment Response:', response);
    } catch (error) {
      setError('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="payment-container">
      <h2>M-PESA Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XXXXXXXX"
            required
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit" className="pay-button">
          Send Payment Request
        </button>
      </form>
    </div>
  );
}

export default PaymentPage;