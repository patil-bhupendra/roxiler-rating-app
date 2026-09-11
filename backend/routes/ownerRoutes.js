const express = require("express");

const {
  getOwnerDashboard,
} = require("../controllers/ownerController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("OWNER"),
  getOwnerDashboard
);

module.exports = router;