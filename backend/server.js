require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// CONNECT DB
connectDB();

app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("SkillSamaritan Backend is running...");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
