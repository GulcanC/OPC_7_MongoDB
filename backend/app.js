const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
dotenv.config();

const publicationRoutes = require("./routes/publication");
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

// app.use("/images-posts", express.static(path.join(__dirname, "images-posts")));

// app.use("/api/auth", postRoutes);

module.exports = app;
