const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");

const userControllers = require("../controllers/user");

// http://localhost:3000/api/auth/signup
router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.put("/:id", multer, userControllers.updateUser);
router.delete("/:id", userControllers.deleteUser);
router.post("/identify", userControllers.identifyUser);

module.exports = router;
