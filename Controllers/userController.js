const User = require("../Models/userModel");
const cart = require("../Models/cartModel");
const blogModel = require("../Models/blogModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");

const createJwtToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.SECRET_STRING, {
    expiresIn: "120 days",
  });
};

// this function is admin purposes only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
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
    return res.json({
      status: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    return res.json({ error: error.message, status: false });
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
  const { email } = req.body;
  try {
    const isUserExist = await User.findOne({ email: email });

    if (!isUserExist) {
      return res.json({ status: false, message: "Email does not exist" });
    }

    const token = jwt.sign({ id: isUserExist._id }, process.env.SECRET_STRING, {
      expiresIn: "1d",
    });

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: true,
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    const mailOptions = {
      from: {
        name: "Suri restaurant",
        address: process.env.USER_EMAIL,
      },
      to: email,
      subject: "Reset Password Link",
      html: `<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">You updated the password for your Twitch account<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#efeef1;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:580px;margin:30px auto;background-color:#ffffff">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="display: flex; justify-content: center; align-items: center; padding: 12px;">
              <tbody style="width:100%; display: flex; justify-content: center; align-items: center;">
                <tr style="width:100%; display: flex; justify-content: center; align-items: center;">
                  <td style="width:100%;">
                  <div style="width: 100%; position: relative; display: flex; justify-content: center;">
                    <img src="https://res.cloudinary.com/dplj90agk/image/upload/v1720330332/c2bdf776-a362-4ee1-afcb-cdcdcaf82113_iqtd7t.jpg" style="display: block; outline: none; border: none; text-decoration: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; max-width: 100%;" width="100" />
                  </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:100%;display:flex">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column" style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
                          <td data-id="__react-email-column" style="border-bottom:1px solid rgb(145,71,255);width:102px"></td>
                          <td data-id="__react-email-column" style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:5px 20px 10px 20px">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">Hi <!-- -->${isUserExist.name}<!-- -->,</p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">You are trying to reset your password on Surendra Restaurant account</p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">Click the following link to reset your password <!-- --> https://suripk-food-app-fd.vercel.app/reset-password-verify/${isUserExist._id}/${token}</p>
                     <p style="font-size:14px;line-height:1.5;margin:16px 0px 4px 0px">Best regards,</p>
                      <p style="font-size:14px;line-height:1.5;margin:0px 0">Surendra parla kuruva</p>
                      <p style="font-size:14px;line-height:1.5;margin:0px 0">Restaurant owner</p>
                      <p style="font-size:14px;line-height:1.5;margin:0px 0">Surendra Restauant</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:580px;margin:0 auto">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody style="width:100%">
                <tr style="width:100%">
                  <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center;color:#706a7b">© 2024 Surendra Restaurant, All Rights Reserved <br />6th cross road, works 99,HSR Layout, Bangalore, KA</p>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: false, message: "Error while sending mail" });
      } else {
        // console.log(info);
        return res.json({
          status: true,
          message: "Reset password link send to provided email",
        });
      }
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

const updatePasswordVerification = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_STRING);
    if (decoded._id !== id) {
      return res.json({ status: false, message: "Invalid token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    return res.json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  loginUser,
  getUserInformation,
  forgotPassword,
  updatePasswordVerification,
};
