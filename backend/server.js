/* const http = require("http");

const app = require("./app");

// s'assure que lorsque nous configurons un port et que nous le recevons via une variable d'environnement, il s'agit d'un nombre valide

const normalizePort = (originalPort) => {
  // analyser  notre port et elle renvoie un entier
  const port = parseInt(originalPort, 10);

  // si le numero de port est illegal, il renvoie notre port d'origine
  if (isNaN(port)) {
    return originalPort;
  }
  // si le numero de port >= 0 , il renvoie le port que nous avons analysé
  if (port >= 0) {
    return port;
  }
  return false;
};

// controler quelle type erreur s'est produite
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges."); // l'autherisation d'acces refusée
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use."); // l'addresse déja utilisée
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// pour enregistrer que nous écoutons les requête entrantes
const onListening = () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
};

// configurer le port, appeler la fonc, passer 3000 sous forme de chaîne
const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

// attacher le serveur pour l'erreur et pour l'ecouteur, demarrer le serveur
const server = http.createServer(app);
server.on("error", errorHandler);
server.on("listening", onListening);
server.listen(port);
 */

// GROUPMANIA MONGOO
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.route");

require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use("/api/user", userRoutes);

//server
app.listen(process.env.PORT, () => {
  console.log(`✅ Listening on port ${process.env.PORT}`);
});
