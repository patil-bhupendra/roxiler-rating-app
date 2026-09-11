const express = require("express");

const { createUser } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createUser
);

module.exports = router;