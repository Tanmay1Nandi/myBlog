const User = require("../models/user.model")
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error");

const signup =async (req, res, next) => {
    const {username, email, password} = req.body;

    try {
        
    if(!username || !email || !password || username === "" || password === "" || email === ""){
        next(errorHandler(400, "All fields are required"));
        return;
    }
    } catch (error) {
        console.log("error")
    }

    //hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password : hashedPassword,
    })

    try {
        await newUser.save();
        res.json({message : "New user created"}) 
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup
}