const express = require("express");
const {
  placingOrder,
  paymentVerification,
} = require("../Controllers/paymentController");

const router = express.Router();
const auth = require("../Middleware/AuthmiddleWare");

router.use(auth);

router.post("/checkout", placingOrder);
router.post("/payment-verification", paymentVerification);

module.exports = router;
