const { Store, Rating } = require("../models");

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    if (!storeId || rating === undefined) {
      return res.status(400).json({
        message: "Store ID and rating are required",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const userId = req.user.id;

    const existingRating = await Rating.findOne({
      where: {
        userId,
        storeId,
      },
    });

    if (existingRating) {
      return res.status(409).json({
        message: "You have already rated this store",
      });
    }

    const newRating = await Rating.create({
      userId,
      storeId,
      rating,
    });

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Submit rating error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  submitRating,
};
