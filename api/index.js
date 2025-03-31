const express = require("express")
const {connectToDb} = require("./connection")
const app = express();
const dotenv = require("dotenv")
dotenv.config();

//middlewares
app.use(express.json());

//connecting to database
connectToDb(process.env.MONGO)
.then(()=> console.log("MonbgoDb connected!"))
.catch((err) => console.log(err))

app.listen(process.env.PORT, ()=> console.log(`Server started at PORT: ${process.env.PORT}!`))

//Routes
const userRouter = require("./routes/user.route")
const authRouter = require("./routes/auth.route")

app.use("/api/test",userRouter);
app.use("/api/auth",authRouter);


//middleware to handle error
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})