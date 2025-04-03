import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, // '127.0.0.1'
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()


// test thử các console log bằng cách gõ node database.js

export async function getCompany() {
    const [rows] = await pool.query("SELECT * FROM company")
    return rows;
}

export async function getCompanyEmployee(id) {
    const [rows] = await pool.query("SELECT * FROM company WHERE id = ?", [id])
    return rows[0];
}

const company = await getCompany()
// console.log(company)

// const companyEmployee = await getCompanyEmployee(1)
// console.log(companyEmployee)

// test adding new employee
export async function addEmployee(name, mail, role){
    const [result] = await pool.query("INSERT INTO company (name, mail, role) VALUES (?, ?, ?)", [name, mail, role])
    const [rows] = await pool.query("SELECT * FROM company WHERE id = ?", [result.insertId])
    return rows[0];
}

// const result = addEmployee('john doe', 'jd@gmail.com', 'Developer')

// console.log(result)


// console.log(company[5].name);
