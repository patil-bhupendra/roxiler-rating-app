const express = require("express");

const {
  createUser,
  createStore,
  assignStoreOwner,
  getDashboardStats,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/users", authMiddleware, roleMiddleware("ADMIN"), createUser);

router.post("/stores", authMiddleware, roleMiddleware("ADMIN"), createStore);

router.put(
  "/stores/:id/owner",
  authMiddleware,
  roleMiddleware("ADMIN"),
  assignStoreOwner,
);

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboardStats,
);

module.exports = router;
