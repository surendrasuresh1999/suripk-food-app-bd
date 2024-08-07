const jwt = require("jsonwebtoken");
const adminModel = require("../Models/adminModel");

const verifyAdminJwtToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization Token Required!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET_STRING);
    // If token is valid, attach user info to the request
    req.user = await adminModel.findOne({ _id }).select("_id");
    // Proceed to the next middleware
    next();
  } catch (err) {
    return res.json({ message: err.message, status: 401 });
  }
};

module.exports = verifyAdminJwtToken;
