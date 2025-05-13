const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, updateUser } = require("../controllers/userController");

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);

module.exports = router;
