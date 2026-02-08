CREATE DATABASE cantilever_bank;
USE cantilever_bank;
CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    pin INT,
    balance DOUBLE
);
CREATE TABLE transactions (
    txn_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT,
    txn_type VARCHAR(20),
    amount DOUBLE,
    txn_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
