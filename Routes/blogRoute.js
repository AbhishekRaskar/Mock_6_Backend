const express = require("express");
const { blogModel } = require("../Models/blogModel");
const { auth } = require("../Middlewares/auth");

const blogRouter = express.Router();

blogRouter.post("/blogs", auth, async (req, res) => {
    try {
        const date = new Date();
        const blog = new blogModel({ ...req.body, userID: req.userID, date });
        await blog.save();
        res.json({ message: "Blog created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

blogRouter.get("/", auth, async (req, res) => {
    try {
        const { category, sort, order } = req.query;
        const query = { userID: req.userID };

        if (category) {
            query.category = category;
        }

        const setOrder = {};
        if (sort) {
            setOrder[sort] = order === "asc" ? 1 : -1;
        }

        const blogs = await blogModel.find(query).sort(setOrder);
        res.status(200).json({ Blogs: blogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



blogRouter.put("/blogs/:id", auth, async (req, res) => {
    try {
        const updatedBlog = await blogModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ message: "Blog updated successfully", updatedBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

blogRouter.delete("/blogs/:id", auth, async (req, res) => {
    try {
        const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ message: "Blog deleted successfully", deletedBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

blogRouter.patch("/blogs/:id/like", auth, async (req, res) => {
    try {
        const updatedBlog = await blogModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { likes: req.userID } },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ message: "Blog liked successfully", updatedBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

blogRouter.patch("/blogs/:id/comment", auth, async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ message: "Comment content is required" });
    }
    try {
        const updatedBlog = await blogModel.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { content, username: req.username } } },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ message: "Comment added successfully", updatedBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    blogRouter
};
