import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { env } from "./config/environment.js"

dotenv.config();
const app = express()

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend is running...")
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://${ env.APP_HOST }:${env.APP_PORT}/`))