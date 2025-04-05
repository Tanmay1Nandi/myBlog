const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        requird: true,
    },
    content:{
        type: String,
        requird: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: "https://tse4.mm.bing.net/th?id=OIP.tuchuEvgEQfcfuxCBEKsBQHaDt&pid=Api&P=0&h=180"
    },
    category: {
        type:String,
        default:"uncategorized",
    },
    slug:{
        type:String,
        required: true,
        unique:true,
    }
},{
    timestamps: true,
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post