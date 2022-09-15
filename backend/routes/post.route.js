const router = require("express").Router();
const postController = require("../controllers/post.controller");

// create post POST
// http://localhost:3000/api/post
router.post("/", postController.createPost);

// get, read post GET
// http://localhost:3000/api/post/:id
router.get("/:id", postController.getOnePost);

// get, read post GET
// http://localhost:3000/api/post
router.get("/", postController.getPost);

// update post PUT
// http://localhost:3000/api/post/:id
router.put("/:id", postController.updatePost);

// delete post DELETE
// http://localhost:3000/api/post/:id
router.delete("/:id", postController.deletePost);

// like post PATCH
// http://localhost:3000/api/post/likePost/:id
//router.patch("/likePost/:id", postController.likePost);

// unlike post PATCH
// http://localhost:3000/api/post/:id
// router.patch("/unlikePost/:id/", postController.unlikePost);
router.post("/:id/like", postController.likeDislike);

// http://localhost:3000/api/post/commentPost/:id
router.patch("/commentPost/:id", postController.commentPost);
// http://localhost:3000/api/post/editCommentPost/:id
router.patch("/editCommentPost/:id", postController.editCommentPost);
// http://localhost:3000/api/post/deleteCommentPost/:id
router.patch("/deleteCommentPost/:id", postController.deleteCommentPost);
module.exports = router;
