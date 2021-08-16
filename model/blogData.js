const mongoose = require('mongoose')

const BlogPostSchema = mongoose.Schema({
    uniqueId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    descript:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now()
    }
})

const Post = mongoose.model('post',BlogPostSchema)

module.exports = Post