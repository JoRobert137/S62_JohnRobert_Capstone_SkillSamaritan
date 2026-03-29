const { body } = require("express-validator");

const isStringArray = (value) => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

exports.signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("skills")
    .optional()
    .custom((value) => {
      if (typeof value === "string") return true;
      if (isStringArray(value)) return true;
      throw new Error("skills must be an array of strings or comma-separated string");
    }),
];

exports.loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email required"),
  body("password")
    .notEmpty()
    .withMessage("Password required"),
];

exports.createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description required"),
  body("points")
    .isFloat({ gt: 0 })
    .withMessage("Points must be a number greater than 0"),
  body("skillsRequired")
    .optional()
    .custom((value) => {
      if (isStringArray(value)) return true;
      throw new Error("skillsRequired must be an array of strings");
    }),
];

exports.updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email required"),
  body("skills")
    .optional()
    .custom((value) => {
      if (isStringArray(value)) return true;
      throw new Error("skills must be an array of strings");
    }),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),
];
