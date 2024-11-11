const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const [ground, setGround] = React.useState({
//   name: "",
//   location: "",
//   sizeWidth: "",
//   sizeLength: "",
//   slotTimings: "",
//   weekend_rate: 0,
//   reserved_timings: "",
//   weekday_with_light: 0,
//   weekday_without_light: 0,
//   weekend_after_midnight: 0,
// });

const groundSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  sizeWidth: {
    type: Number,
    required: true,
  },
  sizeLength: {
    type: Number,
    required: true,
  },
  slotTimings: {
    type: String,
    required: true,
  },
  weekend_rate: {
    type: Number,
    required: true,
  },
  reserved_timings: {
    type: String,
    required: true,
  },
  weekday_with_light: {
    type: Number,
    required: true,
  },
  weekday_without_light: {
    type: Number,
    required: true,
  },
  weekend_after_midnight: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Ground', groundSchema);


//example postman post request
// {
//   "name": "Ground 1",
//   "location": "Askari 4",
//   "sizeWidth": 100,
//   "sizeLength": 200,
//   "slotTimings": "10:00 AM - 12:00 PM",
//   "weekend_rate": 500,
//   "reserved_timings": "12:00 PM - 2:00 PM",
//   "weekday_with_light": 1000,
//   "weekday_without_light": 800,
//   "weekend_after_midnight": 1200
// }
