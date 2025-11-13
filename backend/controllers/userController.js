const User = require("../models/userModel");

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, skills } = req.body;

    if (req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use." });
      }
      updateData.email = email;
    }
    if (skills) {
      if (!Array.isArray(skills))
        return res.status(400).json({ message: "Skills must be an array." });
      updateData.skills = skills;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
