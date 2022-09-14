const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    postUserId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      max: 600,
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    // "like" is a user who likes the post of the user "likes" comes from user.model.js
    //likers
    /*  like: {
      type: [String],
      required: true,
    }, */

    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    comment: {
      type: [
        {
          commentUserId: String,
          commentUserName: String,
          text: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("post", postSchema);
module.exports = PostModel;
