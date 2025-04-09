const User = require("../models/user.model")
const errorHandler = require("../utils/error")
const bcryptjs = require("bcryptjs")

const test = (req, res) => {
    return res.json({message: "Hello hello"})
}

const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to update this user"))
    }
    if(req.body.password){
        if(req.body.password.length < 8){
            return next(errorHandler(400, "Password should contain atleast 8 characters"))
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(req.body.password)) {
            return next(errorHandler(400, "Password must contain at least one uppercase letter, one lowercase letter, and one number"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if(req.body.username){
        const oldUser = await User.findOne({username: req.body.username});
        if (oldUser && oldUser._id.toString() !== req.params.userId) {
            return next(errorHandler(400, "Username already exists"));
        }

        if(req.body.username.length < 6 || req.body.username.length > 25){
            return next(errorHandler(400, "Username must be between 6 to 25 characters"));
        }
        if(req.body.username.includes(" ")){
            return next(errorHandler(400, "Username cannot contain spaces"));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, "Username must be lowercase"));
        }
        if (!/^[a-z0-9_]+$/.test(req.body.username)) {
            return next(errorHandler(400, "Username can only contain lowercase letters, numbers, and _"));
        }        
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        },{new: true});
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    }
    catch(error){
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to delete this user"));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

const adminDeleteUser = async(req,res,next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to delete this user."))
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json("User has been signed out.");
    } catch (error) {
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not authorized to see all the users."))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === "asc" ? 1 : -1;
        const users = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const {password, ...rest} = user._doc;
            return rest;
        });
        
        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        })

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });

    } catch (error) {
        next(error);
    }
}

const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user) {
            return errorHandler(404, "User not found");
        }
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    test,
    updateUser,
    deleteUser,
    signout,
    getUsers,
    adminDeleteUser,
    getUser
}