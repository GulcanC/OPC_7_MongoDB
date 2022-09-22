/* require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// it is necessary to access the images
const path = require("path");

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
    // mongodb+srv://P7:<password>@cluster0.ckve18r.mongodb.net/?retryWrites=true&w=majority
  )
  .then(() => console.log("✅ Connection to MongoDB is successful !"))
  .catch(() => console.log("⛔️ Connection to MongoDB failed!"));

app.use(express.json());

// CORS - Permet d'accéder au front - lien entre les 2 serveurs grâce aux autorisations ci-dessous
// CORS: cross-origin request sharing
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // tout le monde peut se connecter a notre API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // On donne l'autorisation d'utiliser certains headers sur l'objet requête
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); //envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
  next(); // permet de passer à la lecture des autres middlewares
});

app.use("/api/post", postRoutes);
app.use("/api/auth", userRoutes);

// *** traiter les requêtes vers la route /image, en rendant notre dossier images statique.
// dirname est le chemin absolu vers le répertoire contenant le fichier source.
app.use("/images", express.static(path.join(__dirname, "images")));

//permet d'exporter l'application pour pouvoir y accéder depuis les autres fichiers
module.exports = app;
 */

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
