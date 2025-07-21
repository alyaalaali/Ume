const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User
