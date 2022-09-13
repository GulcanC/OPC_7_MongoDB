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
    like: {
      type: [String],
      required: true,
    },
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
    timeStamp: true,
  }
);

const PostModel = mongoose.model("post", postSchema);
module.exports = PostModel;
