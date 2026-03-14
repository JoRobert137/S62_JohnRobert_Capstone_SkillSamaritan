const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const {
	signupValidation,
	loginValidation,
} = require("../utils/validationSchemas");

router.post("/signup", signupValidation, validateRequest, authController.signup);
router.post("/login", loginValidation, validateRequest, authController.login);

module.exports = router;
