const adminmodel = require("../Models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createJwtToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.SECRET_STRING, {
    expiresIn: "120 days",
  });
};

const signupAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await adminmodel.findOne({ email });

    if (existingUser) {
      return res.json({ status: false, message: "email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = await adminmodel.create({
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

const loginAdmin = async (req, res) => {
  //   const { _id } = req.user;
  const { email, password } = req.body;

  try {
    const isAdminExist = await adminmodel.findOne({
      email,
    });
    if (!isAdminExist) {
      return res.json({
        status: false,
        message: "Sorry you don't have permission",
      });
    }
    const match = await bcrypt.compare(password, isAdminExist.password);

    if (!match) {
      return res.json({ status: false, message: "Invalid password" });
    }
    // create token
    const token = createJwtToken(isAdminExist._id);
    return res.json({
      status: true,
      message: "logged in successfully",
      isAdminExist,
      token,
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

const forgotPasswordAdmin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await adminmodel.findOne({ email });
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
