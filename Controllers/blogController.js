const blogModel = require("../Models/blogModel");
const userModel = require("../Models/userModel");
const subscribersModel = require("../Models/subscriberModel");
const nodeMailer = require("nodemailer");

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

// return date and time
function formatDate(inputDate) {
  // Parse the input date string
  const date = new Date(inputDate);

  // Create an array of month names for conversion
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract year, month, day, hours, minutes, seconds from the date object
  const year = date.getFullYear();
  const month = date.getMonth(); // Note: getMonth() returns 0-based index
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the date part
  const formattedDate = `${monthNames[month]} ${day}, ${year}`;

  // Format the time part
  let period = "AM";
  let formattedHours = hours;
  if (formattedHours >= 12) {
    period = "PM";
    if (formattedHours > 12) {
      formattedHours -= 12;
    }
  }
  if (formattedHours === 0) {
    formattedHours = 12;
  }
  const formattedTime = `${formattedHours}:${
    (minutes < 10 ? "0" : "") + minutes
  }:${(seconds < 10 ? "0" : "") + seconds} ${period}`;

  // Combine date and time parts
  const formattedDateTime = `${formattedDate}, ${formattedTime}`;

  return formattedDateTime;
}

// create a new blog post
const createBlogPost = async (req, res) => {
  try {
    // Create the blog post
    const newBlog = await blogModel.create({
      ...req.body,
    });

    // Fetch subscribers' emails from the database
    const subscribers = await subscribersModel.find();

    // Prepare email sending
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Prepare and send email to each subscriber
    subscribers.forEach(async (subscriber) => {
      const mailOptions = {
        from: {
          name: "Surendra Restaurant",
          address: process.env.USER_EMAIL,
        },
        to: subscriber.email,
        subject: "New Recipe Blog Released",
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
                                <p style="font-size:14px;line-height:1.5;margin:16px 0">Dear <!-- -->${
                                  subscriber.name
                                }<!-- -->,</p>
                                <p style="font-size:14px;line-height:1.5;margin:16px 0">We're excited to announce the release of our latest recipe blog post! 🎉🎉🎉<!-- --> <!-- --> <!-- -->${String(
                                  formatDate(newBlog.createdAt)
                                )}</p>
                                <p style="font-size:16px;line-height:1.5;margin:16px 0">${
                                  newBlog.title
                                }</p>
                                <p style="font-size:16px;line-height:1.5;margin:4px 0">${newBlog.discription.slice(
                                  0,
                                  56
                                )} <!-- -->read more...</p>
                                <p style="font-size:24px;line-height:1.5;margin:16px 0">Check out the full post<!-- --> <a href="#" style="color:#067df7;text-decoration:underline" target="_blank">blogs/${
                                  newBlog._id
                                }</a></p>
                                <p style="font-size:14px;line-height:1.5;margin:16px 0">Thank you for being a valued subscriber. We hope you enjoy this new content!<!-- --></p>
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

      try {
        transporter.sendMail(mailOptions);
        console.log(`Email sent to ${subscriber.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}`, error);
      }
    });

    // Respond to the client after processing all emails
    return res.json({
      status: true,
      message: "Blog created and emails sent successfully",
    });
    
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// delete blog post
const deleteBlogPost = async (req, res) => {
  const { _id } = req.user;
  try {
    const blogPost = await blogModel.findOne({ _id: req.params.id });

    if (!blogPost) {
      return res.json({ error: "Blog post not found", status: false });
    }

    await blogModel.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog deleted successfully", status: true });
  } catch (error) {
    console.log("Error: ", error);
    res.json({ error: error.message, status: 404 });
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
