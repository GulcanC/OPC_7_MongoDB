const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// isEmail is library which sends true or false for validation of email
const { isEmail } = require("validator");
// create table for user
// trim for deleting spaces
// lowercase true, for email uppercase or lowercase is possible
// unique, the same email can not be used
const userSchema = new mongoose.Schema(
  {
    // pseudo
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 4,
      min: 4,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    bio: {
      type: String,
      max: 1000,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

/* const uniqueValidator = require("mongoose-unique-validator");
userSchema.plugin(uniqueValidator); */

// bcrypt
/* userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
}); */

// login compare user password with the password which in tha database
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("⛔️ Password is wrong!");
  }
  throw Error("⛔️ Email is wrong!");
};
// in tha table its "users" pluriel, it always pluriels for tables
// this "user" is "users" in the mongoDB
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
