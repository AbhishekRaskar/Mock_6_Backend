const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Business', 'Tech', 'Lifestyle', 'Entertainment'], required: true },
    username: { type: String },
    likes: [{ type: String }],
    date: { type: Date }, 
    userID: { type: String },
    comments: [{
        content: { type: String, required: true },
        username: { type: String, required: true },
    }],
}, {
    versionKey: false,
});

const blogModel = mongoose.model('blog', blogSchema);

module.exports = {
    blogModel
};
