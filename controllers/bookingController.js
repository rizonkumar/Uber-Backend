const bookingService = require("../services/bookingService");
const { io } = require("../index");
const locationService = require("../services/locationService");

/**
 * This function handles creating a new booking and notifying nearby drivers.
 *
 * @param {Object} io - The Socket.IO server instance.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 *
 * @returns {Object} - A JSON response indicating success or failure.
 */
const createBooking = (io) => async (req, res) => {
  try {
    console.log("1"); // Logging step 1 for debugging purposes.

    const { source, destination } = req.body; // Extract source and destination from request body.

    const booking = await bookingService.createBooking({
      passengerId: req.user._id,
      source,
      destination,
    });
    console.log("Booking created", booking); // Log creation with booking details.

    const nearByDrivers = await bookingService.findNearByDrivers(source); // Find drivers near the source.
    console.log("Nearby drivers", nearByDrivers); // Log nearby drivers.

    const driverIds = [];
    // Iterating over the nearby drivers and sending socket message to each driver
    for (const driver of nearByDrivers) {
      // Need socket Id for notification, retrieved from redis.
      const driverSocketId = await locationService.getDriverSocket(driver[0]);
      console.log("Driver ID", driverSocketId);

      if (driverSocketId) {
        driverIds.push(driverSocketId);
        io.to(driverSocketId).emit("newBooking", {
          bookingId: booking._id,
          source,
          destination,
          fare: booking.fare,
        }); // Emit "newBooking" event to driver with booking information.
      }
    }

    // Store notified driver IDs in redis for tracking.
    await locationService.storeNotifiedDrivers(booking._id, driverIds);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

/**
 * This function handles confirming a booking by assigning a driver and notifying involved parties.
 *
 * @param {Object} io - The Socket.IO server instance.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 *
 * @returns {Object} - A JSON response indicating   
 success or failure.
 */

const confirmBooking = (io) => async (req, res) => {
  try {
    const { bookingId } = req.body; // Extract booking ID from request body.

    // Assign driver to the booking and retrieve updated booking details.
    const booking = await bookingService.assignDriver(bookingId, req.user._id);

    // Get list of driver IDs who were previously notified about the booking.
    const notifiedDriverIds = await locationService.getNotifiedDrivers(
      bookingId
    );

    for (const driverId of notifiedDriverIds) {
      const driverSocketId = await locationService.getDriverSocket(driverId);
      if (driverSocketId) {
        // Check if the driver is the one confirming the booking (passenger).
        if (driverId === req.user._id) {
          io.to(driverSocketId).emit("rideConfirmed", {
            bookingId,
            driverId: req.user._id, // Send driver ID for confirmation.
          });
        } else {
          // If not the passenger, notify other drivers to remove the booking.
          io.to(driverSocketId).emit("removeBooking", { bookingId });
        }
      }
    }

    return res.status(200).json({
      data: booking,
      success: true,
      message: "Ride confirmed successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};
module.exports = { createBooking, confirmBooking };
