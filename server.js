const express = require('express');
const mysql = require('mysql2');
const inquirer = require ('inquirer');
const db = require('./db')
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        password: '062810',
        database: ''
    }
)

function init () {
    console.log("Let's get working!")
    workPrompts();
}

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
}