const PostModel = require("../models/post.model");
const post = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// http://localhost:3000/api/post
module.exports.createPost = async (req, res) => {
  const userPost = new PostModel({
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],

    // like:[],

    comment: [],
    postUserId: req.body.postUserId,
    message: req.body.message,
    video: req.body.video,
  });

  try {
    const post = await userPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// http://localhost:3000/api/post/:id
module.exports.getOnePost = (req, res) => {
  // verify that user id exists in the database, if not stop the function
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("⛔️ id is unknown : " + req.params.id);

  PostModel.findById(req.params.id, (err, docs) => {
    // docs is the data
    if (!err) res.send(docs);
    else {
      console.log("⛔️ id is unknown : " + err);
    }
    // we will send all informations of the user except password
  });
};

// http://localhost:3000/api/post
module.exports.getPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("⛔️ Failed to get post : " + err);
    }
  });
};

// http://localhost:3000/api/post/:id
module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("⛔️ ID is unknown : " + req.params.id);

  const updatedPost = {
    message: req.body.message,
  };

  PostModel.findOneAndUpdate(
    req.params.id,
    { $set: updatedPost },
    { new: true },
    (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log("⛔️ Update can not be realized : " + err);
      }
    }
  );
};

// http://localhost:3000/api/post/:id
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("⛔️ ID unknown : " + req.params.id);
  }

  PostModel.findOneAndDelete(req.params.id, (err, docs) => {
    if (!err) {
      res.send((message = "✅ Post has been deleted successfully!"));
    } else {
      console.log("⛔️ Failed to delete post : " + err);
    }
  });
};

/* // http://localhost:3000/api/post/likePost/:id
module.exports.likePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID is not known !!!: " + req.params.id);
  }

  try {
    PostModel.findOneAndUpdate(
      req.params.id,

      // like is "likers" comes from post.model
      // add the user who likesthe post to the array like in the post.model
      { $addToSet: { like: req.body.id } },
      {
        new: true,
      },
      (err, docs) => {
        if (!err) {
          res.send(docs);
        } else {
          return res.status(400).send(err);
        }
      }
    );
    UserModel.findOneAndUpdate(
      req.body.id,
      {
        // "likes" comes from user.modele
        // add to array "likes" in the user.model
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) {
          res.send(docs);
        } else {
          return res.status(400).send("ID is not known****: " + req.params.id);
        }
      }
    );
  } catch (err) {
    return res.status(400).send("ID is not known==== : " + req.params.id);
  }
}; */

// http://localhost:3000/api/post/unlikePost/:id

exports.likeDislike = (req, res, next) => {
  post
    .findOne({ _id: req.params.id })
    .then((objectPost) => {
      post;
      if (
        !objectPost.usersLiked.includes(req.body.UserId) &&
        req.body.like === 1
      ) {
        console.log("LIKE = 1");
        post
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: 1 },
              $push: { usersLiked: req.body.userId },
            }
          )
          .then(() => res.status(201).json({ message: "Post like +1" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        objectPost.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        console.log("LIKE = 0");
        post
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.id },
            }
          )
          .then(() =>
            res
              .status(201)
              .json({ message: "User like 0, user a annulé son like!" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        !objectPost.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        console.log("DISLIKE = 1");
        post
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: 1 },
              $push: { usersDisliked: req.body.id },
            }
          )
          .then(() => res.status(201).json({ message: "User disLike +1" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        objectPost.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        console.log("DISLIKE = 0");
        post
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.id },
            }
          )
          .then(() =>
            res
              .status(201)
              .json({ message: "User disLike 0, user a annulé son dislike!" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));

  console.log("💧 Like post 💧");
  console.log(req.body); // la requete sera envoyé par le body
  console.log("_id =" + " " + req.params.id); // récupérer l'id de l'URL de la requête
  console.log(req.params); // récupérer l'id de l'URL de la requête
};
