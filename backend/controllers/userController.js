const User = require("../models/userModel");

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// GET LEADERBOARD (TOP 10 BY POINTS)
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select("name points earnedPoints")
      .sort({ points: -1, createdAt: 1 })
      .limit(10);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, skills, bio, location } = req.body;

    if (req.user.id !== id && req.user._id.toString() !== id) {
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
    if (typeof bio === "string") {
      updateData.bio = bio;
    }
    if (typeof location === "string") {
      updateData.location = location;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(updatedUser);

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
