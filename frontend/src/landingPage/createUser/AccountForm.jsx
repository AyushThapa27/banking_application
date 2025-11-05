import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AccountForm() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Add this
  const { userId, name } = location.state || {};

  const [formData, setFormData] = useState({
    accountType: "",
    initialBalance: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountData = {
      userId: userId,
      accountType: formData.accountType,
      balance: parseFloat(formData.initialBalance) || 0,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/accounts/create",
        accountData
      );
      setMessage(res.data.message);
      setFormData({ accountType: "", initialBalance: "" });

      // ✅ Redirect to home page after success
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating account");
    }
  };

  return (
    <div className="container-fluid mt-4" style={{ textAlign: "center" }}>
      <h2>Create Account Form</h2>

      <div className="container col-8 mt-5 card">
        <form className="row g-3 p-5" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="fullname" className="form-label">
              UserName
            </label>
            <input
              type="text"
              className="form-control"
              id="fullname"
              value={name || ""}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="accountType" className="form-label">
              Account Type
            </label>
            <select
              className="form-control"
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              <option value="">--Account type--</option>
              <option value="saving">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="initialBalance" className="form-label">
              Initial Balance
            </label>
            <input
              type="number"
              className="form-control"
              id="initialBalance"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleChange}
              placeholder="Enter Initial Balance"
              required
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success">
              Create Account
            </button>
          </div>
        </form>

        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}
