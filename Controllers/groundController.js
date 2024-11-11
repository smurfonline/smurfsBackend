const Ground = require("../Models/ground");

const createGround = async (req, res) => {
  try {
    const ground = req.body;
    console.log("ground", ground);
    ground.reserved_timings = ground.reserved_timings_start + " - " + ground.reserved_timings_end;
    //check if the ground already exists
    const groundExists = await Ground.findOne({ name: ground.name });
    if (groundExists) {
      return res.status(400).json({ message: "Ground already exists" });
    }
    //get the slot timings
    const startHours = ground.startTime.split(":");
    const startMinutes = parseInt(startHours[1]);
    const endHours = ground.endTime.split(":");
    const endMinutes = parseInt(endHours[1]);
    //check if the start time is less than the end time
    if(endHours[0] == '00') {
      endHours[0] = '24';
    }
    if (startHours[0] > endHours[0]) {
      return res.status(400).json({ message: "Start time must be less than end time" });
    }
    //check if the start time is equal to the end time
    if (startHours[0] == endHours[0] && startMinutes >= endMinutes) {
      return res.status(400).json({ message: "Start time must be less than end time" });
    }

    //get the reserved timings
    const reservedTimings = ground.reserved_timings.split(" - ");
    const reservedStartHours = reservedTimings[0].split(":");
    const reservedEndHours = reservedTimings[1].split(":");
    //check if the reserved start time is less than the reserved end time
    if(reservedEndHours[0] == '00') {
      reservedEndHours[0] = '24';
    }
    if (reservedStartHours[0] > reservedEndHours[0]) {
      return res.status(400).json({ message: "Reserved start time must be less than reserved end time" });
    }
    //check if the reserved start time is equal to the reserved end time
    if (reservedStartHours[0] == reservedEndHours[0] && reservedStartHours[1] >= reservedEndHours[1]) {
      return res.status(400).json({ message: "Reserved start time must be less than reserved end time" });
    }


    const newGround = 
    {
      name: ground.name,
      location: ground.location,
      sizeWidth: ground.sizeWidth,
      sizeLength: ground.sizeLength,
      slotTimings: ground.startTime + " - " + ground.endTime,
      weekend_rate: ground.weekend_rate,
      reserved_timings: ground.reserved_timings,
      weekday_with_light: ground.weekday_with_light,
      weekday_without_light: ground.weekday_without_light,
      weekend_after_midnight: ground.weekend_after_midnight,
    }

    await Ground.create(newGround);
    res.status(201).json({ ground });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find();
    res.status(200).json({ grounds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getGround = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);
    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }
    res.status(200).json({ ground });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGround = async (req, res) => {
  try {
    const ground = await Ground.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }
    res.status(200).json({ ground });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//export
module.exports = {
  createGround,
  getGrounds,
  getGround,
  updateGround,
};
