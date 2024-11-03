const passengerService = require("../services/passengerService");

const getPassengerBookings = async (req, res) => {
  try {
    const bookings = await passengerService.getPassengerBookings(req.user._id);
    return res.status(201).send({
      data: bookings,
      success: true,
      error: null,
      message: "Bookings retrieved successfully",
    });
  } catch (error) {
    return res.status(500).send({
      data: null,
      success: false,
      error: error.message,
      message: "Failed to retrieve bookings",
    });
  }
};

const provideFeedback = async (req, res) => {
  try {
    const { bookingId, rating, feedback } = req.body;
    await passengerService.provideFeedback(
      req.user._id,
      bookingId,
      rating,
      feedback
    );
    res.status(201).send({
      success: true,
      message: "Feedback provided successfully",
      error: null,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Failed to provide feedback",
    });
  }
};

module.exports = { getPassengerBookings, provideFeedback };
