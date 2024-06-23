const blogModel = require("../Models/blogModel");
const userModel = require("../Models/userModel");
const mongoose = require("mongoose");

// get all blog posts
const getAllBlogPosts = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await userModel.findById({ _id: _id.toString() });
    if (!user) {
      return res.json({ status: 404, message: "User not found" });
    }
    const blogs = await blogModel.find();
    res.json({
      status: 200,
      message: "Fetching all blogs",
      blogs,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
  }
};

// get all blog posts
const getBlogPostById = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await userModel.findById({ _id: _id.toString() });
    if (!user) {
      return res.json({ status: 404, message: "User not found" });
    }

    const blogPost = await blogModel.findById({ _id: req.params.id });
    res.json({
      status: true,
      message: "Fetched blog post by id",
      blogPost,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
  }
};

// create a new blog post
const createBlogPost = async (req, res) => {
  // const { _id } = req.user;
  try {
    await blogModel.create({
      ...req.body,
    });
    res.json({
      message: "Blog created Successfully",
      status: true,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
  }
};

// delete blog post
const deleteBlogPost = async (req, res) => {
  const { _id } = req.user;
  const userId = _id.toString();
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }

    const blogPost = await blogModel.findById(req.params.id);

    if (!blogPost) {
      return res.json({ error: "Blog post not found", status: 404 });
    }

    if (blogPost.user.toString() !== userId) {
      return res.json({
        error: "You can't delete other user's posts",
        status: 403,
      });
    }

    await blogModel.findByIdAndDelete(req.params.id);

    res.json({ message: "Your blog post deleted successfully", status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    res.json({ error: error.message, status: error.status });
  }
};

const dropLikeForPost = async (req, res) => {
  const { _id } = req.user;
  try {
    const blogObj = await blogModel.findById({ _id: req.params.id });
    if (!blogObj) {
      return res.json({ status: 404, message: "Blog details not found" });
    }
    const isUserExist = blogObj.likedUsers.includes(_id);
    if (isUserExist) {
      blogObj.likedUsers.pull(_id);
      await blogObj.save();
      return res.json({ status: true, message: "You have removed your like" });
    } else {
      blogObj.likedUsers.push(_id);
      await blogObj.save();
      return res.json({
        status: true,
        message: "You have added your opinion",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.json({ error: error.message, status: 400 });
  }
};

const updateBlogPost = async (req, res) => {
  const { _id } = req.user;

  try {
    const isBlogExist = await blogModel.findById(req.params.id);
    if (!isBlogExist) {
      return res.json({ status: 404, message: "Blog not found" });
    }
    await blogModel.findByIdAndUpdate(req.params.id, req.body);
    return res.json({ status: true, message: "Blog update successful" });
  } catch (error) {
    return res.json({ message: error.message, status: 404 });
  }
};

module.exports = {
  getAllBlogPosts,
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  dropLikeForPost,
  updateBlogPost,
};
