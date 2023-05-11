DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE  employee_db;
USE employee_db; 

CREATE TABLE IF NOT EXISTS departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
); 

CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL, 
    salary DECIMAL (10,2) NOT NULL,
    department_role VARCHAR(30) NOT NULL
); 

CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    role VARCHAR(30) NOT NULL,
    manager VARCHAR(30)
);