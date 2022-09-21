//******* vérifier les tokens d'authentification de l'utilisateur

//utilisation du package jsonwebtoken
const jwt = require("jsonwebtoken");
require("dotenv").config();

//logique
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //récupère le token en splitant le header
    const decodedToken = jwt.verify(token, process.env.JWT_KEY_TOKEN); //décode et vérifie si le token est valide
    const userId = decodedToken.userId; //récupère userId du token décodé
    req.auth = {
      userId: userId, //ajoute sa valeur à la req qui sera transmit aux routes ou middleware
    };

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
