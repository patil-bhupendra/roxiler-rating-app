const { Store, Rating } = require("../models");
const { Op } = require("sequelize");

const getStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    const where = {};

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (address) {
      where.address = {
        [Op.like]: `%${address}%`,
      };
    }

    const stores = await Store.findAll({
      where,
      attributes: ["id", "name", "address"],

      include: [
        {
          model: Rating,
          attributes: ["rating", "userId"],
        },
      ],
    });

    const result = stores.map((store) => {
      const ratings = store.Ratings || [];

      let overallRating = 0;

      if (ratings.length > 0) {
        const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);

        overallRating = totalRating / ratings.length;
      }

      const userRating = ratings.find((item) => item.userId === req.user.id);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: Number(overallRating.toFixed(1)),
        userRating: userRating ? userRating.rating : null,
      };
    });

    res.status(200).json({
      count: result.length,
      stores: result,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getStores,
};
