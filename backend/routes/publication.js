const express = require("express");
const router = express.Router();

const publicationCtrl = require("../controllers/publication");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// http://localhost:3000/api/publication
router.post("/", auth, multer, publicationCtrl.createPost);
// http://localhost:3000/api/publication
router.get("/", auth, publicationCtrl.getAllPost);
// http://localhost:3000/api/publication/:id
router.put("/:id", auth, multer, publicationCtrl.updatePost);
// http://localhost:3000/api/publication/:id
router.delete("/:id", auth, publicationCtrl.deletePost);
// http://localhost:3000/api/publication/:id/like
router.post("/:id/like", auth, publicationCtrl.likePost);
// http://localhost:3000/api/publication/:id/like
// router.post("/:id/dislike", auth, publicationCtrl.dislikePost);

module.exports = router;
