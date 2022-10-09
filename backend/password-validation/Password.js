const passwordValidator = require("password-validator");

// npm install password-validator
const passwordSchema = new passwordValidator();
passwordSchema
  .is()
  .min(4) // Minimum 4 characters
  .is()
  .max(4) // Maximum 4 characters
  .has()
  .uppercase(1) // 1 uppercase letter
  .has()
  .lowercase(1) // 1 lowercase letters
  .has()
  .digits(1) // 1 digit
  .has()
  .symbols(1) // 1 special character
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);
module.exports = passwordSchema;
