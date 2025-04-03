import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { env } from "./config/environment.js"

import {getCompany, getCompanyEmployee, addEmployee} from "./database.js"

dotenv.config();
const app = express()

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend is running...")
});

// test company
app.get("/company", async (req, res) => {
  const companyList = await getCompany()
  res.send(companyList)
})

app.get("/company/:id", async (req, res) => {
  const { id } = req.params
  const companyEmployee = await getCompanyEmployee(id)
  res.send(companyEmployee)
})

app.post("/company", async (req, res) => {
  const { name, mail, role } = req.body
  const newEmployee = await addEmployee(name, mail, role)
  res.send(newEmployee)
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://${ env.APP_HOST }:${env.APP_PORT}/`))