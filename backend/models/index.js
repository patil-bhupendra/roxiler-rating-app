const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

User.hasMany(Rating, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Rating.belongsTo(User, {
  foreignKey: "userId",
});

Store.hasMany(Rating, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
});

Rating.belongsTo(Store, {
  foreignKey: "storeId",
});

User.hasOne(Store, {
  foreignKey: "ownerId",
  onDelete: "SET NULL",
});

Store.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

module.exports = {
  User,
  Store,
  Rating,
};