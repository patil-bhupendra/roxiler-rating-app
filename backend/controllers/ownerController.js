const { Store, Rating, User } = require("../models");

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({
      where: {
        ownerId,
      },
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found for this owner",
      });
    }

    const ratings = await Rating.findAll({
      where: {
        storeId: store.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    let averageRating = 0;

    if (ratings.length > 0) {
      const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);

      averageRating = totalRating / ratings.length;
    }

    const ratingList = ratings.map((item) => ({
      userId: item.User.id,
      name: item.User.name,
      email: item.User.email,
      rating: item.rating,
    }));

    res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
      },
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
      ratings: ratingList,
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getOwnerDashboard,
};
