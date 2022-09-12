const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get token
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY_TOKEN, {
    expiresIn: maxAge,
  });
};

// http://localhost:3000/api/user/register
module.exports.signUp = (req, res, next) => {
  console.log("🎉🎉🎉USER SIGNUP🎉🎉🎉");
  console.log(req.body);

  // It should be 4 characters, 1 lowercase, 1 uppercase, 1 numeric, 1 special character
  let regExPassword = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{4}$/
  );
  let regExEmail = new RegExp(
    /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/
  );

  let testEmail = regExEmail.test(req.body.email);
  let testPassword = regExPassword.test(req.body.password);

  if (testEmail && testPassword === true) {
    // 2 hasher le mot de passe
    // 4 appeler la fonction bcrypte.hash() pour crypte le mot de passe
    // 5 on lui passe le mot de passe du corps de la requête qui sera passé par le frontend
    bcrypt
      // 6 executer l'algorithme de hashage 10 fois, pour créer un mot de passe sécurise
      .hash(req.body.password, 10)
      // 7 recuperer le hash de mot de passe et enregisterr dans un neouveu user
      .then((hash) => {
        const user = new UserModel({
          // 8 passer l'addresse email qui fournie dans le corps de la requête
          email: req.body.email,
          name: req.body.name,
          // 9 passer le mot de passe pour enregistrer le hash
          password: hash,
        });
        // 10 utiliser la methode save() pour l'enregistrer l'utilisateur dans la base de données
        user
          .save()
          .then(() =>
            res.status(201).json({ message: "🔅 User is created and saved!" })
          )
          .catch(() => res.status(400).json({ error }));
      })

      .catch((error) => res.status(500).json({ error }));
  }
  /* const { name, email, password } = req.body;

    try {
      const user = await UserModel.create({ name, email, password });
      res.status(201).json({ user: user._id });
    } catch (err) {
      //  const errors = errors_signUp(err);
      res.status(200).send(err);
    } */
};

// http://localhost:3000/api/user/login
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("😇 LOGIN");
  console.log(req.body);
  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);

    console.log("🔸 Login get token");
    console.log(token);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(200).json(err);
  }
};

// http://localhost:3000/api/user/logout
module.exports.logout = async (req, res) => {
  console.log("🟢 Logout is succesfull! No cookies received from the server");
  // 1 une milisecond
  res.cookie("jwt", " ", { maxAge: 1 });
  res.redirect("/");
};
