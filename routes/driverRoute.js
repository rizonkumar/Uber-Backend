const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/bookings", authMiddleware, getDriverBookings);
router.get("/locations", authMiddleware, updateLocation);

module.exports = router;
