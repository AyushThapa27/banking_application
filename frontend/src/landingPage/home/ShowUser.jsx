import { useEffect, useState } from "react";
import axios from "axios";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users"); // your backend endpoint
        setUsers(res.data.users || []); // fallback if undefined
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
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
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId}>
              <th scope="row">{index + 1}</th>
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
                <button className="btn btn-info btn-sm">View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
