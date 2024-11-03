const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getPassengerBookings,
  provideFeedback,
} = require("../controllers/passengerController");

const router = express.Router();

router.get("/bookings", authMiddleware, getPassengerBookings);
router.post("/feedback", authMiddleware, provideFeedback);

module.exports = router;
