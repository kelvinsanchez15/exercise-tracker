const express = require("express");
const router = express.Router();
const User = require("../models/user");

// POST new user
router.post("/new-user", async (req, res) => {
  const { username } = req.body;

  try {
    // Check if the user exist in the database
    const findOne = await User.findOne({ username: username });
    // If exist send a error message
    if (findOne) return res.json({ error: "Username already taken" });
    // Else create new user and respond with json
    const newUser = await User.create({ username: username });
    res.json({ username: username, _id: newUser._id });
  } catch (err) {
    console.log(err);
    res.json({ error: "Database error" });
  }
});

// POST new exercise
router.post("/add", async (req, res) => {
  const { userId, description, duration } = req.body;
  let { date } = req.body;

  // Check for empty input fields
  if (!(userId && description && duration))
    return res.json({ error: "Fill all required inputs" });

  // Handle empty date
  date ? (date = new Date(date)) : (date = new Date());

  // Create new exercise object to push
  const newExercise = {
    description: description,
    duration: duration,
    date: date,
  };

  try {
    const result = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { log: newExercise } },
      { new: true, useFindAndModify: false }
    );

    // If the userId don't exist return error
    if (!result)
      return res.json({
        error: "The userId provided don't exist in the database",
      });

    // Else return
    res.json({
      _id: userId,
      username: result.username,
      date: date.toDateString(),
      duration: parseInt(duration),
      description: description,
    });
  } catch (err) {
    console.log(err);
  }
});

// GET all users from the database
router.get("/users", async (req, res) => {
  try {
    res.json(await User.find({}, "_id username"));
  } catch (err) {
    res.json({ error: "database error" });
  }
});

// GET log from userId
router.get("/log", async (req, res) => {
  const { userId, from, to, limit } = req.query;

  // Search for full log
  const result = await User.findById(userId).lean();

  // If the userId don't exist return error
  if (!result)
    return res.json({
      error: "The userId provided don't exist in the database",
    });

  // Filter log by date range
  if (from) {
    const fromDate = new Date(from + "T00:00:00");
    const toDate = to ? new Date(to + "T23:59:59") : null;

    result.log = dateFilter(result.log, fromDate, toDate);
  }

  // Limit log entries
  if (limit) {
    result.log = result.log.slice(0, parseInt(limit));
  }

  // Parse date format
  result.log.forEach((log) => (log.date = log.date.toDateString()));

  // Return json
  res.json({
    _id: userId,
    username: result.username,
    count: result.log.length,
    log: result.log,
  });
});

// Date Filter function
const dateFilter = (arr, fromDate, toDate) => {
  return (
    arr
      // Sort dates in ascending order
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      // Filter dates by range
      .filter((e) => {
        date = new Date(e.date);
        return toDate ? date >= fromDate && date <= toDate : date >= fromDate;
      })
  );
};

module.exports = router;
