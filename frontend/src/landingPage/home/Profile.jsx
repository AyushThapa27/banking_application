import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${id}`);
      setUser(res.data.user);
      console.log(res.data.user);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const toggleStatus = async () => {
    try {
      await axios.patch(`http://localhost:8080/api/users/${id}/status`);
      fetchUser(); // refresh UI after change
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Profile</h2>

      <div className="card p-4 shadow-sm">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              user.status === "active" ? "text-success" : "text-danger"
            }
          >
            {user.status}
          </span>
        </p>

        <button onClick={toggleStatus} className="btn btn-warning btn-sm mt-2">
          Toggle Status
        </button>

        <hr />

        <h5>Account Details</h5>
        {user.accountId ? (
          <>
            <p>
              <strong>Account Number:</strong> {user.accountNumber}
            </p>
            <p>
              <strong>Account Type:</strong> {user.accountType}
            </p>
            <p>
              <strong>Balance:</strong> ₹{user.balance}
            </p>

            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/transactions/${user.accountId}`)}
            >
              View Transactions
            </button>
          </>
        ) : (
          <p className="text-danger">No account linked to this user.</p>
        )}
      </div>
    </div>
  );
}
