const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/publication");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// http://localhost:3000/api/publication
router.post("/", auth, multer, postCtrl.createPost);
// http://localhost:3000/api/publication
router.get("/", auth, postCtrl.getAllPost);
// http://localhost:3000/api/publication/:id
router.put("/:id", auth, multer, postCtrl.updatePost);
// http://localhost:3000/api/publication/:id
router.delete("/:id", auth, postCtrl.deletePost);
// http://localhost:3000/api/publication/:id/like
router.post("/:id/like", auth, postCtrl.likePost);
// http://localhost:3000/api/publication/:id/like
// router.post("/:id/dislike", auth, postCtrl.dislikePost);

module.exports = router;
