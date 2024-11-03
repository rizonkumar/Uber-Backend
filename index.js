const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const authRoutes = require("./routes/authRoutes.js");
const bookingRoutes = require("./routes/bookingRoutes.js");
const driverRoutes = require("./routes/driverRoute.js");
const passengerRoutes = require("./routes/passengerRoute.js");
const cors = require("cors");
const connectDB = require("./utils/db.js");
const { redisClient } = require("./utils/redisClient.js");

dotenv.config();

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const server = http.createServer(app);
app.use("/api/auth", authRoutes);
// app.use("/api/driver", driverRoutes);
// app.use("/api/booking", bookingRoutes);
app.use("/api/passenger", passengerRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});
