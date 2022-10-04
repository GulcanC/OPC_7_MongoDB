const express = require("express");
const router = express.Router();

const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

const userControllers = require("../controllers/user");

// http://localhost:3000/api/auth
router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.put("/:id", auth, multer, userControllers.updateUser);
router.delete("/:id", auth, userControllers.deleteUser);
router.post("/verify", auth, userControllers.verifyUser);

module.exports = router;
