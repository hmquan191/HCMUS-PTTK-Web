import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, // '127.0.0.1'
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()


// test thử các console log bằng cách gõ node database.js

export async function getTaiKhoan() {
    const [rows] = await pool.query("SELECT * FROM TAIKHOAN")
    return rows;
}

const taiKhoan = await getTaiKhoan()
console.log(taiKhoan)