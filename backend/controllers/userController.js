const User = require("../models/userModel");

// GET
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// POST
exports.createUser = async (req, res) => {
  try {
    const { name, email, skills } = req.body;

    if (!name || !email || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Invalid user data." });
    }

    const user = new User({ name, email, skills });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// PUT
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, skills } = req.body;

    if (!name || !email || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Invalid user data." });
    }

    const user = await User.findByIdAndUpdate(id, { name, email, skills }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
