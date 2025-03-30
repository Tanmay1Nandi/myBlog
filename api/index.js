const express = require("express")
const {connectToDb} = require("../connection")
const app = express();
const dotenv = require("dotenv")
dotenv.config();

//connecting to database
connectToDb(process.env.MONGO)
.then(()=> console.log("MonbgoDb connected!"))
.catch((err) => console.log(err))

app.listen(process.env.PORT, ()=> console.log(`Server started at PORT: ${process.env.PORT}!`))