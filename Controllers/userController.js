const User = require("../Models/userModel");
const cart = require("../Models/cartModel");
const blogModel = require("../Models/blogModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createJwtToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.SECRET_STRING, {
    expiresIn: "120 days",
  });
};

// this function is admin purposes only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    console.log(users);
    if (users.length < 0) {
      return res.json({ error: "No users found", status: false });
    }
    res.json({ status: true, users, message: "Fetching all users" });
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
};

// getParticular user information
const getUserInformation = async (req, res) => {
  const { _id } = req.user;
  const userId = _id.toString();
  try {
    if (!userId) {
      return res.json({ status: 404, message: "User not found" });
    }
    const blogs = await blogModel.find({ user: userId });
    return res.json({
      status: 200,
      blogs: blogs.length,
      quotes: quotes.length,
    });
  } catch (error) {
    return res.json({ status: 400, error: error.message });
  }
};

const createNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ status: false, message: "email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await cart.create({
      user: newUser._id,
      foodItems: [], // Initially an empty array of food items
      totalPrice: 0, // Initially set to 0
    });
    const token = createJwtToken(newUser._id);
    res.json({ status: true, message: "User created successfully", token });
  } catch (error) {
    res.json({ error: error.message, status: false });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: false, message: "Email doesn't exist" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ status: false, message: "Invalid password" });
    }
    // create token
    const token = createJwtToken(user._id);
    return res.json({
      status: true,
      message: "logged in successfully",
      user,
      token,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: false, message: "User doesn't exist" });
    }
    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    user.password = hashedPassword;
    await user.save();
    return res.json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  loginUser,
  getUserInformation,
  forgotPassword,
};
