const express = require('express');
const mysql = require('mysql2');
const inquirer = require ('inquirer');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const db = mysql.createConnection(
    {
        host: 'localhost', 
        user: 'root',
        password: '062810',
        database: ''
    }
)

db.connect((error) => {
    if(error) {
        console.log("Can't connect to database", error);
    }else{
        console.log('Connected to the database')
    }
})


const workPrompts = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice', 
                message: "Let's see what you work force looks like, what are we looking for?",
                choices: [
                    {
                        name: "View All Available Departments?",
                        value: "ViewDepartments"
                    },
                    {
                        name: "View All Available Roles?", 
                        value: "ViewRoles"
                    },
                    {
                        name: "View All Available Employees?",
                        value: "ViewEmployees"
                    },
                    {
                        name: "Add A New Department?",
                        value: "AddDepartment"
                    },
                    {
                        name: "Add A New Role?",
                        value: "AddRole"
                    },
                    {
                        name: "Add A New Employee?",
                        value: "AddEmployee"
                    },
                    {
                        name: "Update An Existing Employee's Role?",
                        value: "UpdateRole"
                    }
                ]
            }
        ])
        .then((answers) => {
            switch (answers.choice) {
                case 'ViewDepartments': 
                    getAllDepartments()
                        .then((departments) => {
                            const table = formatDepartmentsTable(departments);
                            console.log(table);
                            workPrompts();
                        })
                        .catch((error) => {
                            console.error('Error getting departments:', error);
                            workPrompts();
                        });
                break;
                case 'ViewRoles': 
                    getAllRoles()
                        .then((roles) => {
                            const table = formatRolesTable(roles)
                            console.log(table);
                            workPrompts()
                        });
                break;
                case 'AddRole': 
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'roleName', 
                            message: "What's the name of the role you're trying to add?",
                        },
                        {
                            type: 'input', 
                            name: 'salary', 
                            message: "What's the salary for the role you're trying to add?"
                        }, 
                        {
                            type: 'input', 
                            name: 'department', 
                            message: "What department is this new role in?"
                        }
                    ])
                    .then((answers) => {
                        const roleName = answers.roleName;
                        const salary = answers.salary;
                        const department = answers.department;
                        const query = 'INSERT INTO roles (role_name, sakary, department_role) VALUES (?, ?, ?)';

                        db.query(query, [roleName, salary, department], (error) =>{
                            if (error) {
                                console.error("Couldn't add the new role, oops!", error);
                            } else {
                                console.log("Woohoo you added the new role!")
                            }
                            workPrompts();
                        });
                    });
                    break;
                case 'ViewEmployees': 
                        getAllEmployees()
                            .then((employees) => {
                                const table = formatEmployeesTable(employees)
                                console.log(table);
                                workPrompts()
                            });
                break;
                case 'AddEmployee':
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'firstName', 
                                message: "Enter the employee's first name here."
                            }, 
                            {
                                type: 'input', 
                                name: 'lastName', 
                                message: "Enter the employee's last name here."
                            },
                            {
                                type: 'input', 
                                name: 'role', 
                                message: "Enter the employee's role here."
                            }, 
                            {
                                type: 'input', 
                                name: 'manager',
                                message: "Enter the employee's manager here."
                            }
                        ])
                        .then((answers) => {
                            const firstName = answers.firstName; 
                            const lastName = answers.lastName;
                            const role = answers.role;
                            const manager = answers.manager; 
                            const query = 'INSERT INTO employees (first_name, last_name, role, manager) VALUES (?, ?, ?, ?)';
                          
                            db.query(query, [firstName, lastName, role, manager], (error) => {
                              if (error) {
                                console.error("Couldn't add the employee, oops!", error);
                              } else {
                                console.log('Woohoo, you added the new employee!');
                              }
                              workPrompts();
                            });
                          })
                    
                        break;
                          case 'UpdateRole': 
                          getAllEmployees()
                            .then((employees) => {
                                const employeeChoices = employees.map((employee) => ({
                                    name: `${employee.first_name} ${employee.last_name}`, 
                                    value: employee.id,
                                }));
                                inquirer
                                    .prompt([
                                        {
                                            type: 'list', 
                                            name: 'employeeId', 
                                            message: 'Which employee is getting a new role?'
                                        }, 
                                        {
                                            type: 'input',
                                            name: 'newRole', 
                                            message: "What is the employee's new role?"
                                        }
                                    ])
                                 })
                                .then((answers) => {
                                    const employee_id = answers.employee_id
                                    const newRole = answers.newRole
                                    const query = 'UPDATE employees SET role = ? WHERE id = ?';

                                    db.query(query, [newRole, employeeId], (error) => {
                                        if(error) { 
                                            console.error("Couldn't update the employee's role, boo.", error)
                                        } else {
                                            console.log("You updated the employee's role, nice!")
                                        }
                                        workPrompts();
                                    })
                                })
                        break;
                case 'AddDepartment': 
                    inquirer.prompt([
                        {
                            type:'input', 
                            name: 'departnemtName',
                            message:"What's the name of the department you're trying to add?"
                        }
                    ])
                .then((answers) => {
                    const departmentName = answers.departmentName;
                    const query = 'INSERT INTO departments (department_name) VALUES (?)';
                    db.query(query, [departmentName], (error) => {
                        if (error) {
                            console.error("Couldn't Add The Department, oops!", error)
                        } else {
                            console.log('Woohoo, You Added The Department!')
                        }
                        workPrompts()
                    })
                })
            }
        })
}
    
const getAllDepartments = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT department_id, department_name FROM departments';
        
        db.query(query, (error, departments) => {
            if(error) {
                reject(error)
            }else {
                resolve(departments);
            }
        })
    })
};

const formatDepartmentsTable = (departments) => {
    const formattedDepartments = departments.map((department) => ({
        'Department ID': department.department_id,
        'Department Name': department.department_name,
    }))
    return consoleTable.getTable(formattedDepartments)
}
;

const getAllRoles = () => {
    return new Promise ((resolve,reject) => {
        const query = 'SELECT job_title, role_id, department_role, salary FROM roles'; 
        
        db.query(query, (error, roles) => {
            if(error) {
                reject(error)
            }else {
                resolve(roles)
            }
        })
    })
}

const formatRolesTable = (roles) => {
    const formattedRoles = roles.map((role) => ({
        'Role ID': role.role_id,
        'Job Title': role.job_title,
        'Department Role': role.department_role,
        'Salary': role.salary,
    }))
    return consoleTable.getTable(formattedRoles)
}

const getAllEmployees = () => {
    return new Promise ((resolve, reject) => {
        const query = 'SELECT employee_id, first_name, last_name, job_title, department, salary, manager FROM employees'; 

        db.query(query, (error, employees) => {
            if(error) {
                reject(error)
            }else{
                resolve(employees)
            }
            })
        })
}

const formatEmployeesTable = employees => {
    const formattedEmployees = employees.map((employee) => ({
        'Employee ID': employee.employee_id, 
        'Employee First Name': employee.first_name,
        'Employee Last Name': employee.last_name,
        'Job Title': employee.job_title,
        'department': employee.department,
        'salary': employee.salary,
        'Manager': employee.manager,
    }))
    return consoleTable.getTable(formattedEmployees)
    }

    workPrompts();
