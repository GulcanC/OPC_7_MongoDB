// GROUPMANIA MONGOO
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// jsonwebtoken
app.get("*", checkUser);

// get token and user id, http://localhost:3000/jwtid
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//routes user, post
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

//server
app.listen(process.env.PORT, () => {
  console.log(`✅ Listening on port ${process.env.PORT}`);
});
