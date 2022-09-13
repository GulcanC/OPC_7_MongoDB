const router = require("express").Router();
const postController = require("../controllers/post.controller");

// create post POST
// http://localhost:3000//api/post
router.post("/", postController.createPost);

// get, read post GET
// http://localhost:3000//api/post
router.get("/", postController.getPost);

// update post PUT
// http://localhost:3000//api/post/:id
router.put("/:id", postController.updatePost);

// delete post DELETE
// http://localhost:3000//api/post/:id
router.delete("/:id", postController.deletePost);

module.exports = router;
