const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        console.log("🔷 Decoded token: " + decodedToken.id);
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        console.log(res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// get token and user id, http://localhost:3000/jwtid
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY_TOKEN, async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log("🔷 decodedToken.id");
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    // After logout, if you try to get token, it will say "there is no token!"
    console.log("⚠️  no token!");
  }
};
