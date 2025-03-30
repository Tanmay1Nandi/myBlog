const mongoose = require("mongoose");

function connectToDb(url){
    return mongoose.connect(url)
}

module.exports = {
    connectToDb
}
// mongoose.connect("mongodb+srv://tanu:jdTIlR3eZH5w0uUE@blog2.rmdikea.mongodb.net/blog-2?retryWrites=true&w=majority&appName=Blog2")