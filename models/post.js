const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    caption: {
      type: String,
    },
    favoritedByUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    photo: {
      type: String,
      required: true,
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }]
  },
  {
    timestamps: true,
  }
)

const Post = mongoose.model("Post", postSchema)

module.exports = Post
