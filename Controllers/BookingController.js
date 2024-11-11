const Booking = require("../Models/booking");
const Ground = require("../Models/ground");
const { createTransport } = require("nodemailer");

const createBooking = async (req, res) => {
  try {
    console.log("-------------------------------------------");
    const booking = new Booking(req.body);
    console.log(booking);
    //check if the ground is available
    const ground = await Ground.findOne({ name: booking.ground });
    //add 5 hours to the date
    const today = new Date();
    today.setHours(today.getHours() + 5);
    console.log("today", today);
    //also attach time with the date
    const startHour = parseInt(booking.startTime.split(":")[0]);
    const startMinute = parseInt(booking.startTime.split(":")[1]);
    const endHour = parseInt(booking.endTime.split(":")[0]);
    const endMinute = parseInt(booking.endTime.split(":")[1]);

    //check if the start time is less than end time
    if (startHour > endHour) {
      return res.status(400).json({ message: "Invalid time" });
    }

    //check if the start time is equal to end time
    if (startHour === endHour && startMinute >= endMinute) {
      return res.status(400).json({ message: "Invalid time" });
    }

    //check if the booking date is greater than today
    const bookingDate = new Date(booking.date);
    //add start time to the booking date
    bookingDate.setHours(startHour);
    bookingDate.setMinutes(startMinute);

    bookingDate.setHours(bookingDate.getHours() + 5);

    console.log("bookingDate", bookingDate);
    if (today > bookingDate) {
      return res.status(400).json({ message: "Invalid date" });
    }

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    // console.log("ground", ground);
    const groundTiming = ground.slotTimings.split(" - ");
    const groundStartTime = groundTiming[0].split(":");
    const groundEndTime = groundTiming[1].split(":");

    //check if the start time is less than the ground start time
    if (
      startHour < parseInt(groundStartTime[0]) ||
      (startHour === parseInt(groundStartTime[0]) &&
        startMinute < parseInt(groundStartTime[1]))
    ) {
      return res.status(400).json({ message: "The ground has not opened yet" });
    }
    //check if the end time is greater than the ground end time
    if (
      groundEndTime[0] != "00" &&
      (endHour > parseInt(groundEndTime[0]) ||
        (endHour === parseInt(groundEndTime[0]) &&
          endMinute > parseInt(groundEndTime[1])))
    ) {
      return res
        .status(400)
        .json({ message: "The end time exceeds ground end time" });
    } else if (
      groundEndTime[0] == "00" &&
      (endHour > 23 || (endHour === 23 && endMinute > 59))
    ) {
      if (endHour != 24) {
        return res
          .status(400)
          .json({ message: "The end time exceeds ground end time 2" });
      }
    }

    //the booking must be in an increment of 30 minutes
    if (startMinute != 0 && startMinute != 30) {
      return res
        .status(400)
        .json({ message: "The booking must be in an increment of 30 minutes" });
    }

    if (endMinute != 0 && endMinute != 30) {
      return res
        .status(400)
        .json({ message: "The booking must be in an increment of 30 minutes" });
    }

    //check if the ground is available
    //get all bookings of the ground
    const bookings = await Booking.find({ ground: booking.ground });
    //check if the ground is available
    let isAvailable = true;
    bookings.forEach((booking) => {
      //check if the booking date is the same
      if (booking.date.toDateString() === bookingDate.toDateString()) {
        // Parse start and end times of the booking
        const bookingStartHour = parseInt(booking.startTime.split(":")[0]);
        const bookingStartMinute = parseInt(booking.startTime.split(":")[1]);
        const bookingEndHour = parseInt(booking.endTime.split(":")[0]);
        const bookingEndMinute = parseInt(booking.endTime.split(":")[1]);

        // Check if the new booking's start time is within the existing booking's time range
        const isStartTimeInRange =
          (startHour > bookingStartHour ||
            (startHour === bookingStartHour &&
              startMinute >= bookingStartMinute)) &&
          (startHour < bookingEndHour ||
            (startHour === bookingEndHour && startMinute < bookingEndMinute));

        // Check if the new booking's end time is within the existing booking's time range
        const isEndTimeInRange =
          (endHour > bookingStartHour ||
            (endHour === bookingStartHour && endMinute > bookingStartMinute)) &&
          (endHour < bookingEndHour ||
            (endHour === bookingEndHour && endMinute <= bookingEndMinute));

        // Check for overlap: start or end time is in range
        if (isStartTimeInRange || isEndTimeInRange) {
          console.log("Clashing booking", booking);
          isAvailable = false;
        }
      }

      // check if start time falls between the start and end time of the booking or not    why ???????
      // if (
      //   startHour >= parseInt(booking.startTime.split(":")[0]) &&
      //   startHour < parseInt(booking.endTime.split(":")[0])
      // ) {
      //   isAvailable = false;
      // }
    });

    if (!isAvailable) {
      return res.status(400).json({ message: "Booking Time Clashing" });
    }

    //check that it must not be in ground reserved_timings
    const reservedTimings = ground.reserved_timings.split(" - ");
    const reservedStartTime = reservedTimings[0].split(":");
    const reservedEndTime = reservedTimings[1].split(":");

    if (
      startHour >= parseInt(reservedStartTime[0]) &&
      startHour < parseInt(reservedEndTime[0])
    ) {
      return res.status(400).json({ message: "Reserved Timeslot" });
    }

    if (
      endHour > parseInt(reservedStartTime[0]) &&
      endHour <= parseInt(reservedEndTime[0])
    ) {
      return res.status(400).json({ message: "Reserved Timeslot" });
    }

    booking.paid = false;

    await booking.save();
    res.status(201).json({ booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const ground_id = req.params.id;
    const bookings = await Booking.find({ ground: ground_id });
    if (!bookings) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      {
        new: true,
      }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markBookingAsPaid = async (req, res) => {
  console.log(req.body);
  try {
    const paymentMethod = req.body.paymentMethod;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", paymentMethod },
      {
        new: true,
      }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    //send email via nodemailer
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "sohaibsipra869@gmail.com",
        pass: "qnth loml qrpu dxyh",
      },
    });

    const mailOptions = {
      from: "sohaibsipra869@gmail.com",
      to: booking.email,
      subject: "Booking Confirmation",
      text: `Your booking has been confirmed. The booking details are as follows:
      Ground: ${booking.ground}
      Date: ${booking.date}
      Time: ${booking.startTime} - ${booking.endTime}
      Price: ${booking.price}
      Payment Method: ${paymentMethod}
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const markBookingAsUnpaid = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Unpaid", paymentMethod: null },
      {
        new: true,
      }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markBookingAsCompleted = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      {
        new: true,
      }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markBookingAsRejected = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      {
        new: true,
      }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//export
module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
  markBookingAsPaid,
  markBookingAsUnpaid,
  markBookingAsCompleted,
  markBookingAsRejected,
};
