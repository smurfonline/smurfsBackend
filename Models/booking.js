const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// {
//   title: "Booking Reminder",
//   time: "10:00 AM",
//   date: "12th August 2021",
//   ground: "Askari 4",
//   customerName: "John Doe",
//   price: 500,
// },

const bookingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  ground: {
    type: String,
    required: true,
  },  
  customerName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  
});

module.exports = mongoose.model('Booking', bookingSchema);