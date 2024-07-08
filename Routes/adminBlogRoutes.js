const express = require("express");

const adminAuth = require("../Admin/AdminMiddleWare");
const {
  getAllBlogPostsAdmin,
  createBlogPost,
  deleteBlogPost,
  getBlogPostByIdAdmin,
  updateBlogPost,
} = require("../Controllers/adminBlogController");

const router = express.Router();

router.use(adminAuth);
// admin routes

// GET all blog posts
router.get("/", getAllBlogPostsAdmin);

// create a new Blog post
router.post("/", createBlogPost);

// delete a Blog post
router.delete("/:id", deleteBlogPost);

// get blogPost by id
router.get("/:id", getBlogPostByIdAdmin);

// get blogPost by id
router.put("/update/:id", updateBlogPost);

module.exports = router;
