CREATE DATABASE IF NOT EXISTS event_db;
USE event_db;

CREATE TABLE IF NOT EXISTS registrations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(30),
  event_name    VARCHAR(150) NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
