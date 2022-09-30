const Post = require("../models/Publication");
const User = require("../models/User");
const fs = require("fs");

exports.createPost = (req, res, next) => {
  const postObject = req.body;
  let imageUrl = null;

  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  const post = new Post({
    ...postObject,
    imageUrl: imageUrl,
  });
  post
    .save()
    .then(() => res.status(201).json({ post }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPost = (req, res, next) => {
  let postArray = [];
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => {
      posts.forEach((post) => {
        User.findOne({ _id: post.userId }).then((user) => {
          console.log(post.post);
        });
        postArray.push(post);
      });
      res.status(200).json(postArray);
    })
    .catch((error) => res.status(400).json({ error }));
};

//modifier un post logique ok mais ne supprime pas les images du back
exports.updatePost = (req, res, next) => {
  const postObject = req.body;
  let imageUrl = null;

  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    Post.updateOne(
      { _id: req.params.id },
      {
        $set: { imageUrl: imageUrl, post: req.body.post },
      }
    )
      .then(() => {
        Post.findById({ _id: req.params.id })
          .then((post) => res.status(200).json({ post }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    Post.updateOne(
      { _id: req.params.id },
      {
        $set: { post: req.body.post },
      }
    )
      .then(() => {
        Post.findById({ _id: req.params.id })
          .then((post) => res.status(200).json({ post }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
};

// Delete the post function
exports.deletePost = (req, res, next) => {
  User.findOne({ _id: req.auth.userId }).then((user) => {
    Post.findOne({ _id: req.params.id }).then((post) => {
      // if you are not owner of this post and you are not admin, you can not delete the post
      if (post.userId != req.auth.userId && user.admin == "false") {
        res.status(401).json({
          message: "⛔️ You do not have permission to delete the post!",
        });
      } else {
        try {
          Post.findOne({ _id: req.params.id }).then((post) => {
            if (post.imageUrl) {
              const filename = post.imageUrl.split("images/")[1];
              fs.unlink(`images/${filename}`, (error) => {
                console.log("✅ Picture has been succesfully deleted!");
                if (error) throw error;
              });
            } else {
              console.log("⛔️ This post has no files to delete");
            }
            // here deleteUserPost will go to the frontend, it will inform that delete is successfull

            Post.deleteOne({ _id: req.params.id })
              .then((deleteUserPost) => {
                console.log("✅ Post has been succesfully deleted!");
                res.status(200).json({ deleteUserPost });
              })
              .catch((error) => res.status(400).json({ error }));
          });
        } catch {
          (error) => res.status(500).json({ error });
        }
      }
    });
  });
};

exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (!post.usersLiked.includes(req.body.userId)) {
      let toChange = {
        $inc: { likes: +1 },
        $push: { usersLiked: req.body.userId },
      };

      Post.updateOne({ _id: req.params.id }, toChange)

        .then(() => {
          Post.findOne({ _id: req.params.id }).then((updatedPost) =>
            res.status(200).json({ message: "Post liked!", updatedPost })
          );
        })
        .catch((error) => res.status(400).json({ error }));
    } else if (post.usersLiked.includes(req.body.userId)) {
      Post.updateOne(
        { _id: req.params.id },

        { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
      )
        .then(() => {
          Post.findOne({ _id: req.params.id }).then((updatedPost) =>
            res.status(200).json({ message: "Like canceled", updatedPost })
          );
          // res.status(200).json({ message: 'Post unliked', post })
        })
        .catch((error) => res.status(400).json({ error }));
    }
  });
};

exports.dislikePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (!post.usersDisliked.includes(req.body.userId)) {
      let toChange = {
        $inc: { dislikes: +1 },
        $push: { usersDisliked: req.body.userId },
      };

      Post.updateOne({ _id: req.params.id }, toChange)

        .then(() => {
          Post.findOne({ _id: req.params.id }).then((updatedPost) =>
            res.status(200).json({ message: "Post disliked!", updatedPost })
          );
        })
        .catch((error) => res.status(400).json({ error }));
    } else if (post.usersDisliked.includes(req.body.userId)) {
      Post.updateOne(
        { _id: req.params.id },

        { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }
      )
        .then(() => {
          Post.findOne({ _id: req.params.id }).then((updatedPost) =>
            res.status(200).json({ message: "Disliked canceled", updatedPost })
          );
        })
        .catch((error) => res.status(400).json({ error }));
    }
  });
};
