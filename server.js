const express = require('express');
const mysql = require('mysql2');
const inquirer = require ('inquirer');
const db = require('./db')
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
        user:'root',
        password: '062810',
        database: ''
    }
)

Connection.connect((error) => {
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
        .then((answers) =>{
            switch (answers.choice) {
                case 'ViewDepartments': 
                    getAllDepartments()
                        .then((departments) => {
                        const table = formatDepartmentsTable(departments)
                        console.log(table)
                        workPrompts();
                })
                .catch((error) => {
                    console.error('Error Getting Departments, oops', error);
                    workPrompts()
                })
                break;
                case 'ViewRoles': 
                    getAllRoles()
                        .then((roles) => {
                            const table = formatRolesTable (roles)
                            console.log(table);
                            workPrompts()
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

            }
            })
        }

const getAllDepartments = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT department_id, department_name FROM available departments';
        
        db.query(query, (error, departments) => {
            if(error) {
                reject(error)
            }else {
                resolve(departments);
            }
        })
    })
};

const formatDepartmentsTable = (departments => {
    const formattedDepartments = departments.map((department) => ({
        'Department ID': department.department_id,
        'Department Name': department.department_name,
    }))
    return consoleTable.getTable(formattedDepartments)
});

const getAllRoles = () => {
    return new Promise ((resolve,reject) => {
        const query = 'SELECT job_title, role_id, department_role, and salary FROM roles'; 
        
        db.query(query, (error, roles) => {
            if(error) {
                reject(error)
            }else {
                resolve(roles)
            }
        })
    })
}

const formatRolesTable = roles => {
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
        const query = 'SELECT employee_id, employee_firstName, employee_lastName, job_title, department, salary, manager FROM employees'; 

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