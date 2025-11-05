const express = require("express");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// ✅ Use connection pool instead of single connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "learningMySQL@123",
  database: "bankingsystem",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Optional: Log if pool has an error
pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err);
});

// ✅ Test route
app.get("/test", (req, res) => {
  console.log("✅ Test route hit");
  res.send("Backend is connected");
});

// ✅ Create new user
app.post("/api/users/create", async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (userId, name, email, password, role, address, phone)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    pool.query(
      sql,
      [userId, name, email, hashedPassword, role, address, phone],
      (err, result) => {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(409)
              .json({ message: "Email or phone already exists" });
          }
          return res.status(500).json({ message: "Database error" });
        }

        res.status(201).json({ message: "User created", userId, name });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new account
app.post("/api/accounts/create", (req, res) => {
  const { userId, accountType, balance } = req.body;

  if (!userId || !accountType) {
    return res.status(400).json({ error: "Missing account fields" });
  }

  const accountId = uuidv4();
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const accountBalance = balance || 0;

  const query = `
    INSERT INTO accounts (accountId, userId, accountNumber, accountType, balance)
    VALUES (?, ?, ?, ?, ?)
  `;

  pool.query(
    query,
    [accountId, userId, accountNumber, accountType, accountBalance],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting account:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({
        message: "✅ Account created successfully",
        insertedCount: result.affectedRows,
      });
    }
  );
});

// ✅ Get all users
app.get("/api/users", (req, res) => {
  const query =
    "SELECT userId, name, email, role, phone, address, createdAt FROM users";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ users: results });
  });
});

// ✅ Transaction route with ACID compliance
app.post("/api/transactions/create", async (req, res) => {
  console.log("📥 Received Transaction Request:", req.body);

  const { type, fromAccountId, toAccountId, amount, description } = req.body;
  const amountValue = parseFloat(amount);

  if (!type || isNaN(amountValue) || amountValue <= 0) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }

  const conn = await pool.promise().getConnection();

  try {
    await conn.beginTransaction();
    console.log("🚀 Transaction started");

    // 🔹 Helper: get accountId using accountNumber
    const getAccountIdByNumber = async (accNumber) => {
      const [rows] = await conn.query(
        "SELECT accountId FROM accounts WHERE accountNumber = ?",
        [accNumber]
      );
      if (!rows.length)
        throw new Error(`Account number ${accNumber} not found`);
      return rows[0].accountId;
    };

    // 🔹 Convert frontend account numbers → internal account IDs
    let fromId = fromAccountId;
    let toId = toAccountId;

    if (fromAccountId) fromId = await getAccountIdByNumber(fromAccountId);
    if (toAccountId) toId = await getAccountIdByNumber(toAccountId);

    // 🔹 Helper: get account details using internal ID (locked for transaction)
    const getAccount = async (id) => {
      const [rows] = await conn.query(
        "SELECT accountId, balance FROM accounts WHERE accountId = ? FOR UPDATE",
        [id]
      );
      if (!rows.length) throw new Error(`Account ${id} not found`);
      return rows[0];
    };

    let fromAcc = null;
    let toAcc = null;

    // 💰 Deposit
    if (type === "deposit") {
      if (!toId) throw new Error("To Account ID required for deposit");

      toAcc = await getAccount(toId);
      await conn.query(
        "UPDATE accounts SET balance = balance + ? WHERE accountId = ?",
        [amountValue, toId]
      );

      const transactionId = uuidv4();
      await conn.query(
        `INSERT INTO transactions 
          (transactionId, type, fromAccountId, toAccountId, amount, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [transactionId, "deposit", null, toId, amountValue, description || ""]
      );

      await conn.commit();
      console.log("💾 Deposit transaction committed");
      return res
        .status(201)
        .json({ message: "✅ Deposit successful", transactionId });
    }

    // 🏧 Withdrawal
    if (type === "withdrawal") {
      if (!fromId) throw new Error("From Account ID required for withdrawal");

      fromAcc = await getAccount(fromId);

      if (fromAcc.balance < amountValue)
        throw new Error("Insufficient balance for withdrawal");

      await conn.query(
        "UPDATE accounts SET balance = balance - ? WHERE accountId = ?",
        [amountValue, fromId]
      );

      const transactionId = uuidv4();
      await conn.query(
        `INSERT INTO transactions 
          (transactionId, type, fromAccountId, toAccountId, amount, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transactionId,
          "withdrawal",
          fromId,
          null,
          amountValue,
          description || "",
        ]
      );

      await conn.commit();
      console.log("💾 Withdrawal transaction committed");
      return res
        .status(201)
        .json({ message: "✅ Withdrawal successful", transactionId });
    }

    // 🔁 Transfer
    if (type === "transfer") {
      if (!fromId || !toId)
        throw new Error("Both From and To Account IDs required for transfer");

      fromAcc = await getAccount(fromId);
      toAcc = await getAccount(toId);

      if (fromAcc.accountId === toAcc.accountId)
        throw new Error("Cannot transfer to the same account");

      if (fromAcc.balance < amountValue)
        throw new Error("Insufficient balance for transfer");

      // Deduct from sender
      await conn.query(
        "UPDATE accounts SET balance = balance - ? WHERE accountId = ?",
        [amountValue, fromId]
      );

      // Add to receiver
      await conn.query(
        "UPDATE accounts SET balance = balance + ? WHERE accountId = ?",
        [amountValue, toId]
      );

      const transactionId = uuidv4();
      await conn.query(
        `INSERT INTO transactions 
          (transactionId, type, fromAccountId, toAccountId, amount, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transactionId,
          "transfer",
          fromId,
          toId,
          amountValue,
          description || "",
        ]
      );

      await conn.commit();
      console.log("💾 Transfer transaction committed");
      return res
        .status(201)
        .json({ message: "✅ Transfer successful", transactionId });
    }

    throw new Error("Invalid transaction type");
  } catch (err) {
    console.error("❌ Transaction failed:", err.message);
    await conn.rollback();
    console.log("↩️ Transaction rolled back");
    return res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ✅ Default route
app.use("/", (req, res) => {
  res.send("working fine");
});

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
