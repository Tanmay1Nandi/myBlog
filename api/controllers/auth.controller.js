const User = require("../models/user.model")
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

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
        username : username.toLowerCase(),
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

const signin = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password || email === "" || password === ""){
        return next(errorHandler(400, "All fields are required."))
    }

    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404, "Email or password is wrong"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(404, "Email or password is wrong"))
        }
        const token = jwt.sign(
            {
                id: validUser._id,
                isAdmin : validUser.isAdmin,
            },
            process.env.SECRET,
            {
                expiresIn: '7d'
            }
        )

        const { password : pass, ...rest} = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }).json(rest);
    } catch (error) {
        next(error);
    }
}

const google = async (req, res, next) => {
    const {name, email, googlePhotoUrl} = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.SECRET);
            const {password, ...rest} = user._doc;
            res.status(200).cookie("access_token", token, {
                httpOnly: true
            }).json(rest);
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            
            let newName;
            let isUsernameTaken = true;
    
            while (isUsernameTaken) {
                newName = name.toLowerCase().split(" ").join('') + Math.random().toString(9).slice(-4);
                isUsernameTaken = await User.findOne({ username: newName }) ? true : false;
            }

            const newUser = new User({
                // username: name.toLowerCase().split(" ").join('') + Math.random().toString(9).slice(-4),
                username: newName,
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            })

            await newUser.save();
            const token = jwt.sign({
                id: newUser._id,
                isAdmin: newUser.isAdmin,
            },process.env.SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie("access_token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            }).json(rest);
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signup,
    signin,
    google
}