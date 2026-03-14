const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const path = require('path');

if(process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: path.resolve(__dirname, "../config/.env"),
    });
};

const JWT_SECRET = process.env.JWT_SECRET;

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) return skills;
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const buildAuthResponse = (message, user) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  return {
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      skills: user.skills,
    },
  };
};

// -----SIGNUP-----
exports.signup = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;

    if(!name || !email || !password){
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const normalizedSkills = normalizeSkills(skills);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      skills: normalizedSkills,
    });
    await user.save();

    res.status(201).json(buildAuthResponse("User registered successfully", user));
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//-----LOGIN-----
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist. Please Sign-In' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json(buildAuthResponse("Login successful", user));
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
