import express from "express"
import cors from "cors"
import env from "dotenv"

import { registerUser, loginUser } from './auth.js'

env.config();

const app = express();

app.use(cors())
app.use(express.json());

app.post('/register', registerUser)
app.post('/login', loginUser)

app.listen(process.env.PORT, ()=>{
    console.log(`server running on port ${process.env.PORT}`)
})