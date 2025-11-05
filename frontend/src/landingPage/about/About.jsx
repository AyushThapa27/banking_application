import React from "react";

export default function About() {
  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        About Banking System Project
      </h1>

      <p>
        This is a **Full-Stack Banking Application** designed to simulate core
        banking functionalities. The project includes:
      </p>

      <ul>
        <li>User management: Admin can create users and assign roles.</li>
        <li>
          Account management: Admin can create accounts for users with initial
          balances.
        </li>
        <li>
          Transaction management: Supports deposits, withdrawals, and transfers.
        </li>
        <li>
          Authentication & Authorization: Uses JWT for secure access control.
        </li>
        <li>
          Data integrity: Ensures accurate balances and prevents unauthorized
          access.
        </li>
      </ul>

      <p>
        This project is built using <strong>React</strong> for the frontend,{" "}
        <strong>Node.js + Express</strong> for the backend, and{" "}
        <strong>MySQL</strong> for the database. It demonstrates CRUD
        operations, relational data management, and secure handling of
        transactions.
      </p>

      <p style={{ fontStyle: "italic" }}>
        Note: All data used in this project is for demonstration purposes only.
      </p>
    </div>
  );
}
