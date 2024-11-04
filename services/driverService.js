const driverRepository = require("../repositories/driverRepository");

const locationService = require("../services/locationService");

const updateLocation = async (driverId, { latitude, longitude }) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new Error("Invalid latitude or longitude");
  }
  console.log(
    `Adding to Redis: ${lon.toString()} ${lat.toString()} ${driverId}`
  );

  try {
    const res = await locationService.addDriverLocation(driverId, lat, lon);
    console.log(res);
  } catch (error) {
    console.log(error);
  }

  await driverRepository.updateDriverLocation(driverId, {
    type: "Point",
    coordinates: [lon, lat],
  });
};

module.exports = { updateLocation };
