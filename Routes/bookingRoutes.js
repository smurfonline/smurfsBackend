const express = require("express");
const router = express.Router();

const BookingController = require("../Controllers/BookingController");

router.post("/createBooking", BookingController.createBooking);
router.get("/", BookingController.getBookings);
router.get("/:id", BookingController.getBooking);
router.put("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);
router.put("/cancel/:id", BookingController.cancelBooking);
router.put("/markAsPaid/:id", BookingController.markBookingAsPaid);
router.put("/markAsUnpaid/:id", BookingController.markBookingAsUnpaid);
router.put("/markAsCompleted/:id", BookingController.markBookingAsCompleted);
router.put("/markAsRejected/:id", BookingController.markBookingAsRejected);

module.exports = router;
