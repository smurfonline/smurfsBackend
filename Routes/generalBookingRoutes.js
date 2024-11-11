const express = require("express");
const router = express.Router();

const BookingController = require("../Controllers/generalBookingController");

router.post("/createBooking", BookingController.createBooking);
router.get("/getGrounds", BookingController.getGrounds);
router.get("/getBookings", BookingController.getBookings);
module.exports = router;