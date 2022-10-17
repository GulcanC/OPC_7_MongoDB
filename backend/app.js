const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// security
const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const hpp = require("hpp");

const publicationRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,

    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ Connection to MongoDB is successful !"))
  .catch(() => console.log("⛔️ Connection to MongoDB failed!"));

app.use(cors());
app.use(express.json());

// security
// Mongo sanitize to sanitizes inputs against query selector injection attacks
app.use(mongoSanitize());
// Morgan middleware to create logs
app.use(morgan("combined"));
// HPP middleware to protect against HTTP parameter pollution attacks
app.use(hpp());
// Middleware Helmet afin d'améliorer la sécurité. crossOriginResourcePolicy sur false afin d'autoriser l'affichage des images
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// http://localhost:3000/api
app.use("/api/publication", publicationRoutes);
app.use("/api/auth", userRoutes);
// add images to the folder backend/images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
