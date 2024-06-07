const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const foodRoute = require("./Routes/foodRoutes");

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

// connect to db
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("mongoose connected successfully");
//     // listen for requests
//     app.listen(process.env.PORT || 3000, () => {
//       console.log(`listening on port ${process.env.PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// connecting the application here
app.listen(3000, () => {
  console.log("listening on port 3000");
});
