import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import PaymentForm from "./components/PaymentForm";
import TransactionList from "./components/TransactionList";
import TransactionDetails from "./components/TransactionDetails";
import "./styles/App.css";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>M-PESA Payment Integration</h1>
        <a
          href="https://github.com/FelixOgero/mpesa-daraja-payment-api-integration"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            // marginBottom: "20px",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          View GitHub Repository
        </a>

        <nav>
          <Link to="/">Make Payment</Link>
          <Link to="/transactions">Transactions</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<PaymentForm />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/:id" element={<TransactionDetails />} />
        </Routes>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} M-PESA Integration Demo</p>
      </footer>
    </div>
  );
}

export default App;
