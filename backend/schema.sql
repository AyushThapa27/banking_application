-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    userId CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    address VARCHAR(255),
    phone VARCHAR(15) UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active','inactive') DEFAULT 'active'
);

-- ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS accounts (
    accountId CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    accountNumber BIGINT UNIQUE NOT NULL,
    accountType ENUM('saving', 'current') NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    transactionId CHAR(36) PRIMARY KEY,
    fromAccountId CHAR(36),
    toAccountId CHAR(36),
    type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fromAccountId) REFERENCES accounts(accountId)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (toAccountId) REFERENCES accounts(accountId)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
