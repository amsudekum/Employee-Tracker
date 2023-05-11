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

workPrompts();
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
                        value: "View Departments"
                    },
                    {
                        name: "View All Available Roles?", 
                        value: "View Roles"
                    },
                    {
                        name: "View All Available Employees?",
                        value: "View Employees"
                    },
                    {
                        name: "Add A New Department?",
                        value: "Add Department"
                    },
                    {
                        name: "Add A New Role?",
                        value: "Add Role"
                    },
                    {
                        name: "Add A New Employee?",
                        value: "Add Employee"
                    },
                    {
                        name: "Update An Existing Employee's Role?",
                        value: "Update Role"
                    }
                ]
            }
        ])
        .then((answers) =>{
            switch (answers.choice) {
                case 'View Departments': 
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
            }
            })
        }

const getAllDepartments = () => {
    return new Promise((resolve, reject) => {
        const departmentPrompt = 'SELECT department_id & depeartment_name FROM available departments';
        
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