const express = require("express");
const app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/routes");

// Body parser
app.use(express.urlencoded({ extended: true }));

// Cors used for FCC testing purposes
app.use(cors({ optionSuccessStatus: 200 }));

// Connection to the database and error handling
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

mongoose.connection.on("error", (error) => console.log(error));

// Serving styles and scripts from public dir
app.use(express.static("public"));

// Main route defined
app.get("/", (req, res) => res.sendFile(`${__dirname}/views/index.html`));

// Serving routes
app.use("/api/exercise", routes);

// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ` + port));
