const express = require("express");

const router = express.Router();

const { getFullDashBoardData } = require("../Controllers/dashboardController");
const requireAuth = require("../Admin/AdminMiddleWare");

// before hitting the route it will hit the verify jwt token function
router.use(requireAuth);

router.get("/", getFullDashBoardData);

module.exports = router;
