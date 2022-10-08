const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Password = require("../models/Password");

const fs = require("fs");

require("dotenv").config();

// http://localhost:3000/api/auth/signup
exports.signup = (req, res, next) => {
  console.log("🎉🎉🎉USER SIGNUP🎉🎉🎉");
  console.log(req.body);

  // check the password is valid ?
  if (!Password.validate(req.body.password)) {
    return res.status(401).json({
      message:
        "⛔️ Password must contain 1 uppercase letter, 1 lowercase letter, 1 special character and 1 digit!",
    });
  } else if (req.body.password != req.body.passwordConfirm) {
    return res.status(401).json({
      message: "⛔️ Password  is not correct!",
    });
  } else if (
    Password.validate(req.body.password) &&
    req.body.password === req.body.passwordConfirm
  ) {
    // if the password is correct
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        // create a new user
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          picture: "",
          description: "",
          admin: false,
        });
        user
          .save() // save the new user in the database
          .then(() => res.status(201).json({ message: "✅ User created!" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

// http://localhost:3000/api/auth/login
exports.login = (req, res, next) => {
  console.log("🎉🎉🎉USER LOGIN🎉🎉🎉");
  console.log(req.body);

  // check whether email exists in the database
  User.findOne({ email: req.body.email })
    .then((user) => {
      // if the value is null, user does not exist in the database
      if (user === null) {
        res
          .status(401)
          .json({ message: "⛔️ Account does not exist! Please register!" });
        // if we have a value, compare the password which is in the database and user password
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "⛔️ Email and password do not match" });
            }
            // if password is correct we have userId and token
            else if (valid) {
              res.status(200).json({
                message: "✅ User login is successful!",
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                description: user.description,
                _id: user._id,
                admin: user.admin,

                token: jwt.sign(
                  { userId: user._id },
                  process.env.JWT_KEY_TOKEN,
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// http://localhost:3000/api/auth/:id
exports.updateUser = (req, res, next) => {
  let imageUrl = null;

  // vérifier qu'il y a une image a traiter
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  // The $set operator replaces the value of a field with the specified value.
  User.updateOne(
    { _id: req.params.id },
    {
      $set: { picture: imageUrl, description: req.body.description },
    }
  )
    .then(() => {
      User.findById({ _id: req.params.id }).then((user) =>
        res.status(200).json({
          message: "✅ User profile update is successful!",
          picture: user.picture,
          description: user.description,
        })
      );
    })
    .catch((err) => res.status(500).json({ msg: err }));
};

// findById(id) is almost equivalent to findOne({ _id: id }). If you want to query by a document's _id, use findById() instead of findOne()

// http://localhost:3000/api/auth/:id
exports.deleteUser = (req, res, next) => {
  User.findOne({ _id: req.params.id });
  try {
    User.deleteOne({ _id: req.params.id })
      .then((deleteProfile) => {
        console.log("✅ User has been succesfully deleted!");
        res.status(200).json({
          message: "✅ User has been succesfully deleted!",
          deleteProfile,
        });
      })
      .catch((error) => res.status(400).json(error));
  } catch {
    (error) => res.status(500).json(error);
  }
};

// http://localhost:3000/api/auth/verify
exports.verifyUser = (req, res) => {
  if (!req.headers.authorization) {
    res.status(403).json({
      message: "⛔️ There is an authentication problem! ",
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
