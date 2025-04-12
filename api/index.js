const express = require("express")
const {connectToDb} = require("./connection")
const app = express();
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")

//Deploy to render
const path = require("path");

dotenv.config();

//middlewares
app.use(express.json());
app.use(cookieParser());

//connecting to database
connectToDb(process.env.MONGO)
.then(()=> console.log("MonbgoDb connected!"))
.catch((err) => console.log(err))

app.listen(process.env.PORT, ()=> console.log(`Server started at PORT: ${process.env.PORT}!`))

//Routes
const userRouter = require("./routes/user.route")
const authRouter = require("./routes/auth.route")
const postRouter = require("./routes/post.route")
const commentRouter = require("./routes/comment.route")

app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/post",postRouter);
app.use("/api/comment",commentRouter);


//Deploy to render
app.use(express.static(path.join(__dirname,"..",'/client/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"..", "client", "dist", "index.html"));
})

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