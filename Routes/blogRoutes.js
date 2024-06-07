const express = require("express");

const {
  getAllBlogPosts,
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  dropLikeForPost,
} = require("../Controllers/blogController");

const requiredAuth = require("../Middleware/AuthmiddleWare");

const router = express.Router();

router.use(requiredAuth);

// GET all blog posts
router.get("/", getAllBlogPosts);

// create a new Blog post
router.post("/", createBlogPost);

// delete a Blog post
router.delete("/:id", deleteBlogPost);

// get blogPost by id
router.get("/:id", getBlogPostById);

// get blogPost by id
router.put("/:id", dropLikeForPost);

module.exports = router;
