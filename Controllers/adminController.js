const admin = require("../Models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createJwtToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.SECRET_STRING, {
    expiresIn: "120 days",
  });
};

const loginAdmin = async (req, res) => {
  //   const { _id } = req.user;
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const isAdminExist = await admin.findOne({ email });
    console.log(isAdminExist);
    if (!isAdminExist) {
      return res.json({
        status: false,
        message: "You can't access this application",
      });
    }
    const match = await bcrypt.compare(password, isAdminExist.password);

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
    return res.json({ status: 404, message: error.message });
  }
};

const signupAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await admin.findOne({ email });

    if (existingUser) {
      return res.json({ status: false, message: "email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = await admin.create({
      email,
      password: hashedPassword,
    });

    const token = createJwtToken(newUser._id);
    return res.json({
      status: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    return res.json({ error: error.message, status: 404 });
  }
};

const forgotPasswordAdmin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await admin.findOne({ email });
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

module.exports = { loginAdmin, signupAdmin, forgotPasswordAdmin };
