const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Admin = require("../Models/admin");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
 
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
