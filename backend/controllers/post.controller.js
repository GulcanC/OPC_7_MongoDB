const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// http://localhost:3000/api/post
module.exports.createPost = async (req, res) => {
  const userPost = new PostModel({
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
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
  // chercher l'objet dans la bdd et utiliser findOne() pour trouver l'id de l'objet
  PostModel.findOne({ _id: req.params.id })
    .then((objectPost) => {
      // rechercher userId dans le tableau userLiked, au début c'est faux, userLike ne contient pas userId, utiliser l'exclamation pour inverser que c'est true
      // la requête front like doit etre 1
      if (!objectPost.usersLiked.includes(req.body.id) && req.body.like === 1) {
        console.log("LIKE = 1");
        PostModel.updateOne(
          { _id: req.params.id },
          {
            // Utiliser l'opérateur $inc MongoDB qui incrémente un champ d'une valeur spécifiée
            $inc: { likes: 1 },
            // L'opérateur $push MongoDB ajoute une valeur spécifiée à un tableau.
            $push: { usersLiked: req.body.id },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce like +1" }))
          .catch((error) => res.status(400).json({ error }));
      }

      // 2) like = 0 (likes = 0), Si like = 0, l'utilisateur annule son like
      // Si le tableau userLiked contient le userId et like est 0, l'utilisateur annule son like
      else if (
        objectPost.usersLiked.includes(req.body.id) &&
        req.body.like === 0
      ) {
        console.log("LIKE = 0");
        PostModel.updateOne(
          { _id: req.params.id },
          {
            // To obtain 0 likes should be -1, we will increase from -1
            $inc: { likes: -1 },
            // Si l'utilisateur avait déjà aimé la sauce et qu'il l'a changée, l'opérateur $pull supprimera l'userId du tableau usersLiked
            $pull: { usersLiked: req.body.id },
          }
        )
          .then(() =>
            res
              .status(201)
              .json({ message: "User like 0, user a annulé son like!" })
          )
          .catch((error) => res.status(400).json({ error }));
      }

      // 3) like -1 (dislikes +1), Si like = -1, l'utilisateur n'aime pas la sauce.
      // I will search the userId in the array userDisliked in the object, at first it is false, userDisliked does not include userId, use ! to cenvert it true
      else if (
        !objectPost.usersDisliked.includes(req.body.id) &&
        req.body.like === -1
      ) {
        console.log("DISLIKE = 1");
        PostModel.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.id },
          }
        )
          .then(() => res.status(201).json({ message: "User disLike +1" }))
          .catch((error) => res.status(400).json({ error }));
      }
      // 4) like = 0 (dislikes 0) If the user cancel her dislike, we will see likes = 0, and we will remove the userId from the array userDisliked
      else if (
        objectPost.usersDisliked.includes(req.body.id) &&
        req.body.like === 0
      ) {
        console.log("DISLIKE = 0");
        PostModel.updateOne(
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

  console.log("💧 Like sauce 💧");
  console.log(req.body); // la requete sera envoyé par le body
  console.log("_id =" + " " + req.params.id); // récupérer l'id de l'URL de la requête
  console.log(req.params); // récupérer l'id de l'URL de la requête
};
