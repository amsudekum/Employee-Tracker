INSERT INTO departments (department_name) VALUES 
('Visual'), 
('Main Vocal'), 
('Lead Writer');

INSERT INTO roles (role_name, salary, department_role) VALUES 
('Visual Role', 30000, 'Visual'), 
('Main Vocal Role', 40000, 'Main Vocal'), 
('Leader', 50000, 'Lead Writer'); 

INSERT INTO employees (first_name, last_name, role, manager) VALUES
('Shuhua', 'Yeh', 'Visual', 'Cube'),
('Miyeon', 'Cho', 'Main Vocal', 'Cube')
('Soyeon', 'Jeon', 'Lead Writer', 'Herself')