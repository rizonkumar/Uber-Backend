const bookingRepository = require("../repositories/bookingRepository");
const passengerRepository = require("../repositories/passengerRepository");

const getPassengerBookings = async (passengerId) => {
  try {
    const passengerDetails = await passengerRepository.findPassengerById(
      passengerId
    );
    console.log("Passenger Details from Service Layer", passengerDetails);
    if (!passengerDetails) throw new Error("Passenger not found");
    return passengerDetails;
  } catch (error) {
    console.log(error);
    throw new Error("Error in getting passenger bookings");
  }
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
