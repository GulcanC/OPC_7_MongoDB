const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// use request GET to get users
// http://localhost:3000/api/user
module.exports.getAllUsers = async (req, res) => {
  // we do not want to send our password, all the informations are visibles sur postman except "password", for doing this use method select and this syntax
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// use request GET to get a specific user
// http://localhost:3000/api/user/:id
module.exports.userInfo = (req, res) => {
  // verify that user id exists in the database, if not stop the function
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("⛔️ id is unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    // docs is the data
    if (!err) res.send(docs);
    else {
      console.log("⛔️ id is unknown : " + err);
    }
    // we will send all informations of the user except password
  }).select("-password");
};

// use request PUT to update a user
// http://localhost:3000/api/user/:id
module.exports.updateUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("⛔️ id is unknown : " + req.params.id);
  }
  try {
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      // the mongoose operator $set appends new fields to existing documents
      {
        $set: {
          bio: req.body.bio,
        },
      },
      // Mongoose sets defaults on update() and findOneAndUpdate() when the upsert option is set by adding your schema's defaults to a MongoDB $setOnInsert operator.
      // an upsert means an update that inserts a new document if no document matches the filter
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
      (err, docs) => {
        if (!err) {
          return res.send(docs);
        }
        if (err) {
          return res.status(500).send({ message: err });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// use request DELETE to delete a user
// http://localhost:3000/api/user/:id
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("⛔️ id is unknown : " + req.params.id);
  }
  // The exec() Method is used to test for match in a string. If there is a match this method returns the first match else it returns NULL.
  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "✅ User has been successfully deleted!" });
    console.log("✅ User has been successfully deleted!");
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// use request PATCH to follow a user
// http://localhost:3000/api/user/follow/:id
module.exports.followUser = (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("⛔️ id is unknown : " + req.params.id);

  try {
    // add to the follower list
    UserModel.findByIdAndUpdate(
      req.params.id,
      { $push: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) {
          res.status(201).json(docs);
        } else {
          return res.status(400).json(err);
        }
      }
    );
    // add to the following list
    UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $push: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        //  if (!err) { res.status(201).json(docs);}
        if (err) {
          return res.status(400).json(err);
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ messsage: err });
  }
};

// use request PATCH to unfollow a user
// http://localhost:3000/api/user/unfollow/:id
module.exports.unfollowUser = (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("⛔️ id is unknown : " + req.params.id);

  try {
    // remove from the follower list
    UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) {
          res.status(201).json(docs);
        } else {
          return res.status(400).json(err);
        }
      }
    );
    // remove from the following list
    UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        //  if (!err) { res.status(201).json(docs);}
        if (err) {
          return res.status(400).json(err);
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ messsage: err });
  }
};
