const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// http://localhost:3000/api/user/register
module.exports.signUp = async (req, res) => {
  console.log("😇 CREATE USER");
  console.log(req.body);

  const { name, email, password } = req.body;

  try {
    name;
    const user = await UserModel.create({ name, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(200).send({ err });
  }
};

// http://localhost:3000/api/user/login
module.exports.login = async (req, res) => {
  console.log("😇 LOGIN");
  console.log(req.body);

  await UserModel.findOne({ email: req.body.email })
    // 3 si la requete est bien passé, il faut récuperer l'enregistrement qui est dans la bdd
    .then((user) => {
      // 4 si la valeur est null, l'utilisateur n'existait pas dans notre bdd
      if (user === null) {
        res
          .status(401)
          .json({ mesage: "Paire identifiant/mot de passe incorrecte!" });
      }
      // 5 si nous avons une valeur, on compare le mot de passe de la bdd avec le mot de passe qui nous a été transmis
      else {
        bcrypt
          .compare(req.body.password, user.password)
          // 6 On va regarder la valeur, user
          .then((valid) => {
            // 7 si elle n'est pas valide, c'est a dire il ya une erreur d'authentification = le mot de passe n'est pas correct
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire login/mot de passe incorrecte" });
            } else {
              // 8 si le mot de passe est correct nous avons le userId et le token
              // 9 on installe un package jsonwebtoken qui nous permete de créer des token et de les veérifier
              res.status(200).json({
                userId: user._id,
                // 10 pour le token, appeler la fonction sign
                token: jwt.sign(
                  // 11 le premiere argument creer un objet avec le userId, on est sur que cette requete correspond bien a ce userId
                  { userId: user._id },
                  // 12 deuxime argument est la clé secrete pour l'encodage, utiliser une chaine de caracters plus longue et tres aleatoire pour securiser l'encodage
                  `${process.env.JWT_KEY_TOKEN}`,
                  // 13 expiration pour notre token
                  { expiresIn: "12h" }
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// req.body.email, req.body.password
/* const { email, password } = req.body;
  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(200).send({ err });
  } */
/*
// http://localhost:3000/api/user/logout
module.exports.logout = async (req, res) => {
  console.log("😇 LOGOUT");
  console.log(req.body);
};
 */
