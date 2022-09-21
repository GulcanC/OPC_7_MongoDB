const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Password = require("../models/Password");

const fs = require("fs");

require("dotenv").config();

//permet de créer un user + utiliser le shéma de password et de crypter le mot de passe lors d'une inscription
exports.signup = (req, res, next) => {
  if (!Password.validate(req.body.password)) {
    // si le mot de passe n'est pas valide
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir au min 8 caractères, 1 majuscule et 1 chiffre",
    });
  } else if (req.body.password != req.body.passwordConfirm) {
    // si le mot de passe n'est pas le même
    return res.status(400).json({
      message: "Les mots de passe ne sont pas identiques",
    });
  } else if (
    Password.validate(req.body.password) &&
    req.body.password === req.body.passwordConfirm
  ) {
    // si le mot de passe est ok
    bcrypt
      .hash(req.body.password, 10) //on appel bcrypt auquel on passe le mot de passe et on sel 10fois avec l'algo de hachage
      .then((hash) => {
        //crée un nouvel user avec le model existant
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash, //enregistre le mot de passe haché
          picture: "",
          description: "",
          admin: false,
        });
        user
          .save() //enregistre dans la base de données le nouvel utilisateur
          .then(() => res.status(201).json({ message: "Utilisateur créé !" })) //201 création de ressource
          .catch((error) => res.status(400).json({ error })); //mauvaise requête
      })
      .catch((error) => res.status(500).json({ error })); //500 erreur serveur
  }
};
//permet à l'utilisateur de se connecter
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      //vérifie si l'utilisateur existe
      if (user === null) {
        res
          .status(401)
          .json({ message: "Identifiant/mot de passe incorrecte" });
      } else {
        //verifie si le mot de passe correspond avec le hash de la BDD grace à la méthode compare de bcrypt
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Identifiant/mot de passe incorrecte" });
            } else {
              res.status(200).json({
                //permet d'encoder un nouveau token avec méthode sign
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                description: user.description,
                _id: user._id,
                admin: user.admin,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.JWT_KEY_TOKEN, //clé secrète
                  { expiresIn: "24h" } //au dela de 24h le token ne sera plus valide, l'user devra se reconnecter
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//identifier l'utilisateur en fonction du token
exports.identifyUser = (req, res) => {
  if (!req.headers.authorization) {
    res.status(403).json({
      message: "Il n'y a pas de headers d'authentification",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_KEY_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Token invalid " + err });
      } else {
        User.findById({ _id: decoded.userId }).then((user) => {
          res.status(200).json({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            description: user.description,
            _id: user._id,
            admin: user.admin,
          });
        });
      }
    });
  }
};

exports.updateUser = (req, res, next) => {
  let imageUrl = null;

  // vérifier qu'il y a une image a traiter
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  User.updateOne(
    { _id: req.params.id },
    {
      $set: { picture: imageUrl, description: req.body.description },
    }
  )
    .then(() => {
      User.findById({ _id: req.params.id }).then((user) =>
        res
          .status(200)
          .json({ picture: user.picture, description: user.description })
      );
    })
    .catch((err) => res.status(500).json({ msg: err }));
};

exports.deleteUser = (req, res, next) => {
  User.findOne({ _id: req.params.id });
  try {
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        console.log("User supprimé");
        res.status(200);
      })
      .catch((error) => res.status(400).json(error));
  } catch {
    (error) => res.status(500).json(error);
  }
};
