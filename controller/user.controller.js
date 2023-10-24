const { createClient } = require("redis");

const User = require("../models").User;

const getUsers = async (req, res) => {
  try {
    const client = await createClient()
      .on("error", (err) => {
        console.log("Redis connection error:", err);
      })
      .on("connect", () => {
        console.log("Redis connection established");
      })
      .connect();

    const { page, perPage, sortByFirstName } = req.query;

    let limit = +perPage || 10;
    const offset = page > 0 ? (page - 1) * limit : 0;

    const cacheKey = `users-${page}-${perPage}-${sortByFirstName}`;

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      res.json({ message: "Success", users: JSON.parse(cachedData) });
    } else {
      const orders = [];

      if (sortByFirstName && ["ASC", "DESC"].includes(sortByFirstName)) {
        orders.push(["firstName", sortByFirstName]);
      }

      const users = await User.findAll({ limit, offset, order: orders });

      if (!users) {
        res.json({ message: "Users not found" });
      }

      await client.setEx(cacheKey, 3600, JSON.stringify(users));

      res.json({ message: "Success", users });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { getUsers };
