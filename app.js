const express = require("express");
const app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");
require("dotenv").config();

// Body parser
app.use(express.urlencoded({ extended: true }));

// Cors use for FCC testing purposes
app.use(cors({ optionSuccessStatus: 200 }));

// Connection to the database and error handling
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

mongoose.connection.on("error", (error) => console.log(error));

// Schema setup
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  username: String,
  log: Array,
});

const User = mongoose.model("User", userSchema);

// Serve styles and scripts from public dir
app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(`${__dirname}/views/index.html`));

// POST add new user
app.post("/api/exercise/new-user", async (req, res) => {
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

// POST add new exercise
app.post("/api/exercise/add", async (req, res) => {
  const { userId, description, duration, date } = req.body;
  const newExercise = {
    description: description,
    duration: duration,
    date: date,
  };
  // Check for empty input fields
  if (!(userId && description && duration))
    return res.json({ error: "Fill all required inputs" });

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
      date: date,
      duration: duration,
      description: description,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/exercise/users", async (req, res) => {
  try {
    res.json(await User.find({}, "_id username"));
  } catch (err) {
    res.json({ error: "database error" });
  }
});

// res.json({
//   _id: userId,
//   username: result.username,
//   count: result.log.length,
//   log: result.log,
// });

// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ` + port));
