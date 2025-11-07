-- USERS TABLE
CREATE TABLE users (
    userId CHAR(36) PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    address VARCHAR(255),
    phone VARCHAR(15) UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ACCOUNTS TABLE
CREATE TABLE accounts (
    accountId CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    accountNumber BIGINT UNIQUE NOT NULL,
    accountType ENUM('saving', 'current') NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
    transactionId CHAR(36) PRIMARY KEY,
    type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
    fromAccountId CHAR(36) NULL,
    toAccountId CHAR(36) NULL,
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fromAccountId) REFERENCES accounts(accountId),
    FOREIGN KEY (toAccountId) REFERENCES accounts(accountId)
);
