const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

//✅ AUTHENTIFICATION

// http://localhost:3000/api/user/logout
router.get("/logout", authController.logout);

// http://localhost:3000/api/user/register
router.post("/register", authController.signUp);

// http://localhost:3000/api/user/login
router.post("/login", authController.login);

//✅ CRUD
// http://localhost:3000/api/user
router.get("/", userController.getAllUsers);

// http://localhost:3000/api/user/:id
router.get("/:id", userController.userInfo);

// http://localhost:3000/api/user/:id
router.put("/:id", userController.updateUser);

// http://localhost:3000/api/user/:id
router.delete("/:id", userController.deleteUser);

// http://localhost:3000/api/user/follow/:id
router.patch("/follow/:id", userController.followUser);

// http://localhost:3000/api/user/unfollow/:id
router.patch("/unfollow/:id", userController.unfollowUser);

// http://localhost:3000/api/user/unfollow/:id
router.patch("/unfollow/:id", userController.unfollowUser);

module.exports = router;
