const User = require("../models/userModel");

// GET
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// POST
exports.createUser = async (req, res) => {
  const { name, email, skills } = req.body;
  const user = new User({ name, email, skills });
  await user.save();
  res.status(201).json(user);
};

// PUT
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, skills } = req.body;
  const user = await User.findByIdAndUpdate(id, { name, email, skills }, { new: true });
  res.json(user);
};
