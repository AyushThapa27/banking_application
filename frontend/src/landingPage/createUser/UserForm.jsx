import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    address: "",
    phone: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // POST request to backend
      const res = await axios.post(
        "http://localhost:8080/api/users/create",
        formData
      );

      console.log(res.data);
      const { userId, name } = res.data;

      // Navigate to account form with userId
      navigate("/create/accForm", { state: { userId, name } });
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  return (
    <div className="container-fluid mt-4" style={{ textAlign: "center" }}>
      <h2>Create User Form</h2>

      <div className="container col-8 mt-5 card">
        <form className="row g-3 p-5" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              FullName
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              className="form-control"
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">--Select Role--</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success w-100">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
