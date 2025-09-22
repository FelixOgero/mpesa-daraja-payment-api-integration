import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = 'https://mpesa-daraja-payment-api-integration.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initiatePayment = async (paymentData) => {
  try {
    const response = await api.post('/mpesa/stkpush', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTransactions = async () => {
  try {
    const response = await api.get('/mpesa/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/mpesa/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};