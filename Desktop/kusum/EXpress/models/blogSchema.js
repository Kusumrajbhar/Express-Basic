const mongoose = require('mongoose');
const schema = mongoose.Schema;

//create schema
const blogSchema = new schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required:true
    }
    
}, {timestamps: true});  //date

//create model
const Blog = mongoose.model('Blogs', blogSchema) // collection name given to database

module.exports = Blog;