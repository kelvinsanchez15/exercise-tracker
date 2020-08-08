const mongoose = require("mongoose");
const shortid = require("shortid");

// Schema setup
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  username: String,
  log: [
    {
      _id: {
        type: String,
        default: shortid.generate,
        select: false,
      },
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
