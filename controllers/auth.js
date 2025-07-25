const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user.js")
const Post = require("../models/post.js")

//API's
exports.auth_signup_get = async (req, res) => {
  res.render("auth/sign-up.ejs",{errorMsg:""})
}

exports.auth_signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.render("auth/sign-up", {errorMsg:"Username already taken."})
    
  }
  
  if (req.body.password !== req.body.confirmPassword) {
    return res.render("auth/sign-up",{errorMsg:"Password and Confirm Password must match"})

  }

  //bcryp
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  // validation logic
  const user = await User.create(req.body)

  req.session.user = {
    _id: user._id,
    username: user.username,
  }
  const signedUser = await User.findById(req.session.user._id)
  const allPosts = await Post.find({
    userId: { $in: [signedUser.follow.followingsId] },
  })
    .populate("userId")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username displayName",
      },
    })
  res.render("posts/timeline.ejs", {
    pageName: "Timeline",
    allPosts,
    user: req.session.user,
  })
}

exports.auth_signin_get = async (req, res) => {
  res.render("auth/sign-in.ejs",{errorMsg:""})
}

exports.auth_signin_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.render("auth/sign-in",{errorMsg:"Login failed. Please try again."})
  }
  
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )
  
  if (!validPassword) {
    return res.render("auth/sign-in",{errorMsg:"Login failed. Please try again."})
  }

  //user exist and password matched
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  }

  req.session.previousPages = {
    stack: []
  }
  const signedUser = await User.findById(req.session.user._id)
  const allPosts = await Post.find({
    userId: { $in: [signedUser.follow.followingsId] },
  })
    .populate("userId")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username displayName",
      },
    })
  res.render("posts/timeline.ejs", {
    pageName: "Timeline",
    allPosts,
    user: req.session.user,
  })
}

exports.auth_updateProfileById_get = async (req, res) => {
  const profileUser = await User.findById(req.params.id)
  res.render("users/edit.ejs", { profileUser, pageName: "My Profile" })
}

exports.auth_updateProfileById_put = async (req, res) => {
  try {
    req.body.photo = "/uploadImages/" + req.file.filename

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.redirect(`/users/${req.params.id}`)
  } catch (error) {
    console.log("An error has occured")
  }
}

exports.auth_updatePassword_get = (req, res) => {
  const user = req.session.user
  res.render("auth/update-pass.ejs", { user,errorMsg:"" })
}

exports.auth_updatePassword_post = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.render("auth/update-pass.ejs", {
        user,
        errorMsg: "No user with that ID exists!",
      })

    }
    const validPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.render("auth/update-pass.ejs", {
        user,
        errorMsg: "Your old password was not correct! Please try again.",
      })
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.render("auth/update-pass.ejs", {
        user,
        errorMsg: "Password and Confirm Password must match",
      })
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
    user.password = hashedPassword
    await user.save()
    // res.render("./auth/confpas.ejs", { user })
    res.redirect(`/users/${user._id}`)
  } catch (error) {
    console.error(
      "An error has occurred updating a user's password!",
      error.message
    )
  }
}

exports.auth_deleteProfileById_delete = async (req, res) => {
  try {
    const user = req.session.user
    await User.findByIdAndDelete(req.params.id)
    res.render("index.ejs")
  } catch (error) {
    console.error("An error has occured")
  }
}

exports.users_signout_get = (req, res) => {
  req.session.destroy()
  res.render("index.ejs")
}

exports.profile_get = async (req, res) => {
  const user = await User.findById(req.params.userId)
  const posts = await Post.find({ userId: req.params.userId })
    .sort({
      createdAt: -1,
    })
    .populate("userId")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username displayName",
      },
    })
  const isOwnProfile =
    req.session.user && req.session.user._id.toString() === user._id.toString()

  let userHasFollowed = false
  if (req.session.user) {
    userHasFollowed = user.follow.followersId.some(
      (followerId) => followerId.toString() === req.session.user._id.toString()
    )
  }
  const userId = req.session.user._id
  const postwithlike = posts.map((post) => {
    const islike = post.favoritedByUser.some((user) => user.equals(userId))
    post = post.toObject()
    post.userHasFavorited = islike
    return post
  })

  res.render("users/profile", {
    user,
    posts: posts,
    allPosts: postwithlike,
    followerCount: user?.follow?.followersId?.length || 0,
    followingCount: user?.follow?.followingsId?.length || 0,
    userHasFollowed,
    isOwnProfile,
    req: req,
    currentUser: req.session.user,
  })
}

exports.search_get = async (req, res) => {
  const users = await User.find()
  res.render("users/search.ejs", {
    users,
    pageTitle: "Search",
    pageName: "Search",
    hasSearched: false,
  })
}

exports.search_post = async (req, res) => {
  const string = req.body.string.trim()
  let users = []
  if (string) {
    users = await User.find({
      $or: [
        { username: { $regex: string, $options: "i" } },
        { displayName: { $regex: string, $options: "i" } },
      ],
    })
  }
  res.render("users/search.ejs", {
    users,
    pageTitle: "Search",
    pageName: "Search",
    hasSearched: true,
  })
}
// site used for search engine: https://stackoverflow.com/questions/3305561/how-to-query-mongodb-with-like

exports.follow_create_post = async (req, res) => {
  try {
    // The user who is trying to follow
    const follower = await User.findById(req.params.userId)
    // The user who is being followed

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
    res.redirect(`/users/${req.params.userId}`)
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
    res.redirect(`/users/${req.params.userId}`)
  } catch (error) {
    res.status(500).json({ error: `failed to follow user! ${error}` })
  }
}

exports.following_index_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "follow.followingsId"
    )
    const data = {
      user,
      followingList: user?.follow?.followingsId || [],
      followersList: [],
      pageName: "Following",
    }

    res.render("users/follow", data)
  } catch (error) {
    res.status(500).json({ error: "failed to get the followings list!" })
  }
}

exports.follower_index_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "follow.followersId"
    )

    const data = {
      user,
      followersList: user?.follow?.followersId || [],
      followingList: [],
      pageName: "Followers",
    }
    res.render("users/follow", data)
  } catch (error) {
    res.status(500).json({ error: "failed to get the followers list!" })
  }
}
