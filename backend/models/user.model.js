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
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minLength: 4,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    bio: {
      type: String,
      max: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },

  {
    timestamps: true,
  }
);

const uniqueValidator = require("mongoose-unique-validator");
userSchema.plugin(uniqueValidator);

// method "pre" before the save in the database hash the password
/* userSchema.pre("save", function (next) {
  const salt = bcrypt.genSalt();
  this.password = bcrypt.hash(this.password, salt);
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
