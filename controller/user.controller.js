const User = require("../models").User;

const getUsers = async (req, res) => {
  try {
    const { page, perPage, sortByFirstName } = req.query;

    let limit = +perPage || 10;
    const offset = page > 0 ? (page - 1) * limit : 0;

    const orders = [];

    if (sortByFirstName && ["ASC", "DESC"].includes(sortByFirstName)) {
      orders.push(["firstName", sortByFirstName]);
    }

    const users = await User.findAll({ limit, offset, order: orders });

    if (!users) {
      res.json({ message: "Users not found" });
    }

    res.json({ message: "Success", users });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { getUsers };
