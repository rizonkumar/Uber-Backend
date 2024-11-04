const { redisClient } = require("../utils/redisClient");

class locationService {
  async setDriverSocket(driverId, socketId) {
    await redisClient.set(`driver:${driverId}`, socketId);
  }

  async getDriverSocket(driverId) {
    return await redisClient.get(`driver:${driverId}`);
  }

  async deleteDriverSocket(driverId) {
    await redisClient.del(`driver:${driverId}`);
  }

  async addDriverLocation(driverId, latitude, longitude) {
    try {
      await redisClient.sendCommand([
        "GEOADD",
        "drivers",
        latitude.toString(),
        longitude.toString(),
        driverId.toString(),
      ]);
    } catch (error) {
      console.log("Cannot add driver location to redis", error);
    }
  }

  async findNearByDrivers(longitude, latitude, radiusKm) {
    console.log("Finding drivers near by");
    const nearByDrivers = await redisClient.sendCommand([
      "GEORADIUS",
      "drivers",
      longitude.toString(),
      latitude.toString(),
      radiusKm.toString(),
      "km",
      "WITHCOORD",
    ]);
    console.log("Near by drivers", nearByDrivers);
    return nearByDrivers;
  }

  async storeNotifiedDrivers(bookingId, driverIds) {
    for (const driverId of driverIds) {
      await redisClient.sAdd(`notifiedDrivers:${bookingId}`, driverId);
      console.log(
        `Added driver ${driverId} to the set for booking ${bookingId}, result: ${addedCount}`
      );
    }
  }

  async getNotifiedDrivers(bookingId) {
    return (nearByDrivers = await redisClient.sMembers(
      `notifiedDrivers:${bookingId}`
    ));
  }
}

module.exports = new locationService();
