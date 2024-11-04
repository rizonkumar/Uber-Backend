const bookingRepository = require("../repositories/bookingRepository");
const { haversineDistance } = require("../utils/distanceCalculator");
const locationService = require("./locationService");
const BASIC_FARE = 50;
const RATE_PER_KM = 12;

const createBooking = async ({ passengerId, source, destination, fare }) => {
  const distance = haversineDistance(
    source.latitude,
    source.longitude,
    destination.latitude,
    destination.longitude
  );
  const totalFare = BASIC_FARE + distance * RATE_PER_KM;
  const bookingData = {
    passenger: passengerId,
    source,
    destination,
    fare: totalFare,
    status: "pending",
  };
  const booking = await bookingRepository.createBooking(bookingData);
  return booking;
};

const findNearByDrivers = async (location, radius = 5) => {
  const longitude = parseFloat(location.longitude);
  const latitude = parseFloat(location.latitude);
  const radiusKm = parseFloat(radius);

  console.log("Location --------->>>", longitude, latitude, radiusKm);

  if (isNaN(longitude) || isNaN(latitude) || isNaN(radiusKm)) {
    throw new Error("Invalid coordinates or radius");
  }
  const nearByDrivers = await locationService.findNearByDrivers(
    longitude,
    latitude,
    radiusKm
  );
  console.log("Near By Drivers --------->>>", nearByDrivers);
  return nearByDrivers;
};

const assignDriver = async (bookingId, driverId) => {
  const booking = await bookingRepository.updateBookingStatus(
    bookingId,
    driverId,
    "confirmed"
  );
  if (!booking) throw new Error("Booking not found or already confirmed");
  return booking;
};

module.exports = { createBooking, findNearByDrivers, assignDriver };
