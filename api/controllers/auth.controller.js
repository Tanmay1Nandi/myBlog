const User = require("../models/user.model")
const bcryptjs = require("bcryptjs")

const signup =async (req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === "" || password === "" || email === ""){
        return res.status(400).json({message : "All fields are required"})
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
        res.status(400).json({message:error.message})
    }
}

module.exports = {
    signup
}