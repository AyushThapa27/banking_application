import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ShowTransaction() {
  const { accountId } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!accountId) return;

    axios
      .get(`http://localhost:8080/api/transactions/${accountId}`)
      .then((res) => setTransactions(res.data || []))
      .catch((err) => console.log("Error fetching transactions:", err));
  }, [accountId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Transaction History</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Amount</th>
            <th>From Account</th>
            <th>To Account</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => (
              <tr key={tx.transactionId}>
                <td>{index + 1}</td>
                <td>{tx.type}</td>
                <td>₹{tx.amount}</td>
                <td>{tx.fromAccountNumber || "-"}</td>
                <td>{tx.toAccountNumber || "-"}</td>
                <td>{tx.description || "-"}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
