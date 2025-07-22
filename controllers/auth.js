const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user.js")
const Post = require("../models/post.js")

//API's
exports.auth_signup_get = async (req, res) => {
  res.render("auth/sign-up.ejs")
}

exports.auth_signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send("Username already taken.")
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match")
  }

  //bcryp
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  // validation logic

  const user = await User.create(req.body)
  res.send(`Thanks for signing up ${user.username}`)
}

exports.auth_signin_get = async (req, res) => {
  res.render("auth/sign-in.ejs")
}

exports.auth_signin_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.")
  }

  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )

  if (!validPassword) {
    return res.send("Login failed. Please try again.")
  }

  //user exist and password matched
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  }
  res.render("index.ejs")
}

exports.auth_updateProfileById_get = async (req, res) => {
  res.render("users/edit.ejs")
}

exports.auth_updateProfileById_put = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    // res.redirect(`/users`)
  } catch (error) {
    console.log("An error has occured")
  }
}

exports.auth_updatePassword_get = (req, res) => {
  res.render("auth/update-password.ejs")
}

exports.auth_updatePassword_post = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.send("No user with that ID exists!")
    }
    const validPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.send("Your old password was not correct! Please try again.")
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match")
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
    user.password = hashedPassword
    await user.save()
    res.render("./auth/confpas.ejs", { user })
  } catch (error) {
    console.error(
      "An error has occurred updating a user's password!",
      error.message
    )
  }
}

exports.auth_deleteProfileById_delete = async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id)
    res.render("./user/confirm.ejs")
  } catch (error) {
    console.error("An error has occured")
  }
}

exports.auth_signout_get = (req, res) => {
  req.session.destroy()
  res.redirect("/")
}

exports.profile_get = async (req, res) => {
  const user = await User.findById(req.params.userId)
  const posts = await Post.find({ username: req.params.userId })
  const follows = await User.findOne({ userId: req.params.userId })
  // let followersId = []
  // let followingId = []
  // if (follows) {
  //   if (follows.followersId.length > 0) {
  //     followersId = follows.followersId
  //   }
  //   if (follows.followingId) {
  //     followingId = follows.followingId
  //   }
  // }
  // const populatedList = await Follow.findById(req.params.userId).populate(
  //   "userId"
  // )
  // const userHasFollowed = populatedList.followingId.some((user) =>
  //   user.equals(req.session.user.userId)
  // )

  res.render("users/profile", {
    user,
    posts: posts,
    followerCount: follows?.followersId.length,
    followingCount: follows?.followingId.length,
    userHasFollowed: false,
  })
}

exports.search_get = async (req, res) => {
  const users = await User.find()
  console.log(users)
  res.render("users/search.ejs", { users })
}

exports.search_post = async (req, res) => {
  try {
    const string = req.body.string
    console.log(string)
    const users = await User.find({
      $or: [
        { username: { $regex: string, $options: "i" } },
        { displayName: { $regex: string, $options: "i" } },
      ],
    })

    res.render("users/search.ejs", { users })
  } catch (error) {
    console.error(error)
    res.status(500)("Error searching users")
  }
}
// site used for search engine: https://stackoverflow.com/questions/3305561/how-to-query-mongodb-with-like

exports.follow_create_post = async (req, res) => {
  console.log("it works")
  try {
    // The user who is trying to follow
    const follower = await User.findById(req.params.userId)
    // The user who is being followed
    console.log(req.session.user)
    const followed = await User.findById(req.session.user._id)

    await User.findByIdAndUpdate(followed._id, {
      $push: {
        "follow.followingsId": follower._id,
      },
    })

    await User.findByIdAndUpdate(follower._id, {
      $push: {
        "follow.followersId": followed._id,
      },
    })

    res.send("You followed someone successfully")
  } catch (error) {
    res.status(500).json({ error: `failed to follow user! ${error}` })
  }
}

exports.follow_delete_delete = async (req, res) => {
  try {
    // The user who is trying to follow
    const follower = await User.findById(req.params.userId)
    // The user who is being followed
    const followed = await User.findById(req.session.user._id)

    await User.findByIdAndUpdate(followed._id, {
      $pull: {
        "follow.followingsId": follower._id,
      },
    })

    await User.findByIdAndUpdate(follower._id, {
      $pull: {
        "follow.followersId": followed._id,
      },
    })
    res.send("Follow Deleted Successfuly")
  } catch (error) {
    res.status(500).json({ error: `failed to follow user! ${error}` })
  }
}

exports.following_index_get = async (req, res) => {
  try {
    const userId = req.params.userId
    const following = await User.findOne({ userId }).populate("followingId")

    const data = {
      followingList: [],
      followersList: [],
    }
    if (following && following.followingId) {
      data.followingList = following.followingId
    }

    res.render("users/follow", data)
  } catch (error) {
    res.status(500).json({ error: "failed to get the followings list!" })
  }
}

exports.follower_index_get = async (req, res) => {
  try {
    const userId = req.params.userId
    const followers = await User.findOne({ userId }).populate("followersId")
    const data = {
      followersList: [],
      followingList: [],
    }
    if (followers && followers.followersId) {
      data.followersList = followers.followersId
    }
    res.render("users/follow", data)
  } catch (error) {
    res.status(500).json({ error: "failed to get the followers list!" })
  }
}
