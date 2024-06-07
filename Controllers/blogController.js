const blogModel = require("../Models/blogModel");
const userModel = require("../Models/userModel");
const commentsModel = require("../Models/commentsModel");
const mongoose = require("mongoose");

// get all blog posts
const getAllBlogPosts = async (req, res) => {
  const { _id } = req.user;
  try {
    // Fetch all users
    const allUsers = await userModel.find({});

    // Fetch all blog posts
    const blogPosts = await blogModel.find({});

    // Populate the user field for each blog post with corresponding user info
    const populatedBlogPosts = blogPosts.map((blogPost) => {
      const userId = blogPost.user;
      const userInfo = allUsers.find(
        (user) => user._id.toString() === userId.toString()
      );
      const userName = userInfo ? userInfo.name : ""; // If userInfo is null, assign empty string
      return { ...blogPost._doc, user: userName }; // Assign userName to the user field
    });

    res.json({
      status: 200,
      message: "Fetching all blogs",
      posts: populatedBlogPosts,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
  }
};

// get all blog posts
const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await blogModel.findById({ _id: req.params.id });
    const comments = await commentsModel.find({ blogId: req.params.id });
    for (let i = 0; i < comments.length; i++) {
      const user = await userModel.findById(comments[i].userId.toString());
      comments[i].userId = user;
    }
    const user = await userModel.findById({ _id: blogPost.user });
    const singlePost = { ...blogPost._doc, user: user.name, comments };
    res.json({
      status: 200,
      message: "Fetched blog post by id",
      posts: singlePost,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
  }
};

// create a new blog post
const createBlogPost = async (req, res) => {
  const { _id } = req.user;
  try {
    const resultBlogPost = await blogModel.create({
      user: _id.toString(),
      ...req.body,
    });
    res.json({
      message: "Blog created Successfully",
      resultBlogPost,
      status: 200,
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
      return res.json({ status: 200, message: "You have removed your like" });
    } else {
      blogObj.likedUsers.push(_id);
      await blogObj.save();
      return res.json({
        status: 200,
        message: "You have added your opinion",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.json({ error: error.message, status: error.status });
  }
};

module.exports = {
  getAllBlogPosts,
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  dropLikeForPost,
};
