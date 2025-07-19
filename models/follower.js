const mongoose = require("mongoose")
const { ref } = require("process")

const followerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followingId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followersId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
})

const Follow = mongoose.model("Follow", followerSchema)

module.exports = Follow
