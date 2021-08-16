const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;