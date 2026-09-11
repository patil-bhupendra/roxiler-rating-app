const express = require("express");

const {
  submitRating,
  updateRating,
} = require("../controllers/ratingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, submitRating);

router.put("/:storeId", authMiddleware, updateRating);

module.exports = router;
