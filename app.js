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

// User.create(
//   {
//     username: "prueba123",
//     log: [
//       { description: "algo", duration: 30, date: "Thu Aug 06 2020" },
//       { description: "otra cosa", duration: 60, date: "Thu Aug 08 2020" },
//     ],
//   },
//   (err, newUser) => {
//     if (err) return console.log(err);
//     console.log(newUser);
//     console.log(newUser.log.length);
//   }
// );

// Serve styles and scripts from public dir
app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(`${__dirname}/views/index.html`));

// POST add new user
app.post("/api/exercise/new-user", async (req, res) => {
  const { username } = req.body;

  try {
    // check if user exist in the database
    const findOne = await User.findOne({ username: username });
    // if exist send json with message
    if (findOne) return res.json({ error: "Username already taken" });
    // Else create new user and respond with json
    const newUser = await User.create({ username: username });
    res.json({ userId: newUser._id, username: username });
  } catch (err) {
    console.log(err);
    res.json({ error: "Database error" });
  }
});

// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ` + port));
