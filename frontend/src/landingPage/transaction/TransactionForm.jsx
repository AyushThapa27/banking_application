import { useState } from "react";
import axios from "axios";

export default function TransactionForm() {
  const [formData, setFormData] = useState({
    type: "",
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Convert amount to number before sending
    const dataToSend = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/transactions/create",
        dataToSend
      );

      // Show success message
      setMessage(res.data.message || "✅ Transaction completed successfully!");

      // Clear all fields
      console.log(formData);
      setFormData({
        type: "",
        fromAccountId: "",
        toAccountId: "",
        amount: "",
        description: "",
      });

      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.error ||
          "❌ Transaction failed! Please check details."
      );
    }
  };

  return (
    <div className="container-fluid mt-4" style={{ textAlign: "center" }}>
      <h2>Perform Transaction</h2>

      <div className="container col-8 mt-5 card p-4">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="type" className="form-label">
              Transaction Type
            </label>
            <select
              className="form-control"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">--Select Type--</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="fromAccountId" className="form-label">
              From Account ID
            </label>
            <input
              type="text"
              className="form-control"
              id="fromAccountId"
              name="fromAccountId"
              value={formData.fromAccountId}
              onChange={handleChange}
              placeholder="Sender Account ID (skip for deposit)"
            />
          </div>

          {(formData.type === "transfer" || formData.type === "deposit") && (
            <div className="col-md-6">
              <label htmlFor="toAccountId" className="form-label">
                To Account ID
              </label>
              <input
                type="text"
                className="form-control"
                id="toAccountId"
                name="toAccountId"
                value={formData.toAccountId}
                onChange={handleChange}
                placeholder="Receiver Account ID (skip for withdrawal)"
              />
            </div>
          )}

          <div className="col-md-6">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter Amount"
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="description" className="form-label">
              Description (optional)
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Write short note about transaction"
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success">
              Submit Transaction
            </button>
          </div>
        </form>

        {message && (
          <p
            className="mt-3 fw-bold"
            style={{ color: message.includes("❌") ? "red" : "green" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
