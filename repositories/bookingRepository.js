const Booking = require("../models/booking");

const findBooking = async (criteria) => {
  console.log("Criteria", criteria);
  return await Booking.findOne(criteria);
};

const findBookingsByPassengerId = async (passengerId) => {
  return await Booking.find({ passenger: passengerId });
};

module.exports = { findBooking, findBookingsByPassengerId };
