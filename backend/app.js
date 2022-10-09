const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

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

// Middleware Helmet afin d'améliorer la sécurité. crossOriginResourcePolicy sur false afin d'autoriser l'affichage des images
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// http://localhost:3000/api
app.use("/api/publication", publicationRoutes);
app.use("/api/auth", userRoutes);

//indique comment traiter la requête vers la route /image
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use("/api/auth", postRoutes);

module.exports = app;
