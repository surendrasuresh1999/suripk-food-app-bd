const blogModel = require("../Models/blogModel");
const userModel = require("../Models/userModel");

// get all blog posts
const getAllBlogPosts = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await userModel.findById({ _id: _id.toString() });
    if (!user) {
      return res.json({ status: 404, message: "User not found" });
    }
    const blogs = await blogModel.find();

    return res.json({
      status: 200,
      message: "Fetching all blogs",
      blogs,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
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

module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  dropLikeForPost,
};
