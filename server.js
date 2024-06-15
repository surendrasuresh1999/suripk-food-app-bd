require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const foodRoute = require("./Routes/foodRoutes");
const blogRoute = require("./Routes/blogRoutes");
const userRoute = require("./Routes/userRoutes");
const cartRoute = require("./Routes/cartRoutes");
const subscribeRoute = require("./Routes/subScribeRoutes");
const addressRoute = require("./Routes/addressRoutes");
const serviceRoutes = require("./Routes/servicesRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const orderRoutes = require("./Routes/orderRoutes");

// initialize the application
const app = express();

// give the application access to all the browsers
app.use(cors());

// this will be useful for accessing json data from the client
app.use(express.json());

// Authentication middleware
app.use((req, res, next) => {
  next();
});

// define all routes here
app.use("/api/food", foodRoute);
app.use("/api/blog", blogRoute);
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/subscribe", subscribeRoute);
app.use("/api/address", addressRoute);
app.use("/api/service", serviceRoutes);
app.use("/api", paymentRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/getKey", (req, res) => {
  return res.json({
    status: true,
    keyString: process.env.RAZOR_PAY_KEY,
  });
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoose connected successfully");
    // listen for requests
    app.listen(process.env.PORT || 3000, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
