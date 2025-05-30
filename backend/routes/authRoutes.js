const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    message: "Protected user profile",
    user: req.user,
  });
});

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
