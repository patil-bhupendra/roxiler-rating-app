const bcrypt = require("bcryptjs");
const { User, Store, Rating } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const allowedRoles = ["ADMIN", "USER", "OWNER"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({
        message: "Name, email and address are required",
      });
    }

    const existingStore = await Store.findOne({
      where: { email },
    });

    if (existingStore) {
      return res.status(409).json({
        message: "Store email already registered",
      });
    }

    if (ownerId) {
      const owner = await User.findOne({
        where: {
          id: ownerId,
          role: "OWNER",
        },
      });

      if (!owner) {
        return res.status(400).json({
          message: "Invalid store owner",
        });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null,
    });

    res.status(201).json({
      message: "Store created successfully",
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
      },
    });
  } catch (error) {
    console.error("Create store error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const assignStoreOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;
    const { id } = req.params;

    if (!ownerId) {
      return res.status(400).json({
        message: "Owner ID is required",
      });
    }

    const store = await Store.findByPk(id);

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const owner = await User.findOne({
      where: {
        id: ownerId,
        role: "OWNER",
      },
    });

    if (!owner) {
      return res.status(400).json({
        message: "Invalid owner",
      });
    }

    store.ownerId = ownerId;

    await store.save();

    res.status(200).json({
      message: "Store owner assigned successfully",
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
      },
    });
  } catch (error) {
    console.error("Assign store owner error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const totalStores = await Store.count();

    const totalRatings = await Rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "id",
      order = "ASC",
    } = req.query;

    const where = {};

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (email) {
      where.email = {
        [Op.like]: `%${email}%`,
      };
    }

    if (address) {
      where.address = {
        [Op.like]: `%${address}%`,
      };
    }

    if (role) {
      where.role = role;
    }

    const allowedSortFields = [
      "id",
      "name",
      "email",
      "address",
      "role",
      "createdAt",
    ];

    const selectedSortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "id";

    const selectedOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const users = await User.findAll({
      where,

      attributes: ["id", "name", "email", "address", "role", "createdAt"],

      order: [[selectedSortField, selectedOrder]],
    });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "address", "role", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };

    if (user.role === "OWNER") {
      const store = await Store.findOne({
        where: {
          ownerId: user.id,
        },
      });

      if (store) {
        const ratings = await Rating.findAll({
          where: {
            storeId: store.id,
          },
          attributes: ["rating"],
        });

        let averageRating = 0;

        if (ratings.length > 0) {
          const totalRating = ratings.reduce(
            (sum, item) => sum + item.rating,
            0,
          );

          averageRating = totalRating / ratings.length;
        }

        userDetails.store = {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          averageRating: Number(averageRating.toFixed(1)),
          totalRatings: ratings.length,
        };
      }
    }

    res.status(200).json({
      user: userDetails,
    });
  } catch (error) {
    console.error("Get user details error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "id", order = "ASC" } = req.query;

    const where = {};

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (email) {
      where.email = {
        [Op.like]: `%${email}%`,
      };
    }

    if (address) {
      where.address = {
        [Op.like]: `%${address}%`,
      };
    }

    const allowedSortFields = ["id", "name", "email", "address", "createdAt"];

    const selectedSortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "id";

    const selectedOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: [],
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn("AVG", sequelize.col("Ratings.rating")),
            0,
          ),
          "overallRating",
        ],
      ],
      group: ["Store.id"],
      order: [[selectedSortField, selectedOrder]],
    });

    res.status(200).json({
      count: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createUser,
  createStore,
  assignStoreOwner,
  getDashboardStats,
  getUsers,
  getStores,
  getUserDetails,
};
