const express = require("express");
const mongoose = require("mongoose");


const dotenv = require("dotenv");
const cors = require("cors");

//get middleware
const authMiddleware = require("./Middleware/verifyAdmin");

dotenv.config();
const app = express();
app.use(cors(
  {
    origin: "https://smurfsgroundbooking.com/",
  }
));
app.use(express.json());

const authRoutes = require("./Routes/authRoutes");
const groundRoutes = require("./Routes/groundRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const generalBookingRoutes = require("./Routes/generalBookingRoutes");

app.use("/auth", authRoutes);
app.use("/ground", authMiddleware.verifyAdmin, groundRoutes);
app.use("/booking", authMiddleware.verifyAdmin, bookingRoutes);
app.use("/generalBooking", generalBookingRoutes);

const PORT = process.env.PORT || 3003;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connected successfully");
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
}
);

