import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-5" style={{ textAlign: "center" }}>
      <div className="mb-5">
        <h2>Users Table</h2>
      </div>

      <table className="table table-striped table-hover p-5">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId}>
              <th>{index + 1}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td
                className={
                  user.status === "inactive" ? "table-danger" : "table-success"
                }
              >
                {user.status === "inactive" ? "Inactive" : "Active"}
              </td>

              <td>
                <Link to={`/profile/${user.userId}`}>
                  <button className="btn btn-info btn-sm">View Profile</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
