const driverService = require("../services/driverService");

const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new Error("Latitude and longitude must be numbers");
    }
    await driverService.updateLocation(req.user.id, { latitude, longitude });
    res
      .status(200)
      .json({ message: "Location updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// const getDriverBookings = async (req, res) => {
//   try {
//     const bookings = await driverService.getDriverBookings(req.user._id);
//     res.status(201).send({
//       data: bookings,
//       success: true,
//       error: null,
//       message: "successfully retreived driver bookings",
//     });
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

module.exports = { updateLocation };
