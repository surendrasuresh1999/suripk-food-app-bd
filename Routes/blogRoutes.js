const express = require("express");

const {
  getAllBlogPosts,
  getBlogPostById,
  dropLikeForPost,
} = require("../Controllers/blogController");

const requiredAuth = require("../Middleware/AuthmiddleWare");

const router = express.Router();

// client routes
router.use(requiredAuth);

// GET all blog posts
router.get("/", getAllBlogPosts);

// get blogPost by id
router.put("/:id", dropLikeForPost);

// get blogPost by id
router.get("/:id", getBlogPostById);

module.exports = router;
