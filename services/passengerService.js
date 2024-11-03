const bookingRepository = require("../repositories/bookingRepository");

const getPassengerBookings = async (passengerId) => {
  const bookings = await bookingRepository.findBookingsByPassengerId(
    passengerId
  );
  return bookings;
};

const provideFeedback = async (passengerId, bookingId, rating, feedback) => {
  try {
    const booking = await bookingRepository.findBooking({
      _id: bookingId,
      passenger: passengerId,
    });
    console.log("Booking from Service Layer", booking);
    if (!booking) throw new Error("Booking not found");
    booking.rating = rating;
    booking.feedback = feedback;
    await booking.save();
  } catch (error) {
    console.log(error);
    throw new Error("Error in providing feedback");
  }
};

module.exports = {
  getPassengerBookings,
  provideFeedback,
};
