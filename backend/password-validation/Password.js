const passwordValidator = require("password-validator");

// npm install password-validator
const passwordSchema = new passwordValidator();
passwordSchema
  .is()
  .min(6) // Minimum 6 characters
  .is()
  .max(6) // Maximum 6 characters
  .has()
  .uppercase(1) // 1 uppercase letter
  .has()
  .lowercase(1) // 1 special character
  .has()
  .symbols(1) // 1 lowercase letters
  .has()
  .digits(3) // 1 digit
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);
module.exports = passwordSchema;
