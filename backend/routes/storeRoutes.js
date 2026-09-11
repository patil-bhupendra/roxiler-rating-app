const express = require("express");

const { getStores } = require("../controllers/storeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getStores);

module.exports = router;