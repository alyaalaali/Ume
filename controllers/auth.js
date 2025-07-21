const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user.js")
const Post = require("../models/post.js")
const Follow = require("../models/post.js")

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
  res.redirect("/")
}

exports.auth_updateProfileById_get = async (req, res) => {
  res.render('users/edit.ejs')
}

exports.auth_updateProfileById_put = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    // res.redirect(`/users`)
  } catch (error) {
    console.log('An error has occured')
  }
}

exports.auth_updatePassword_get = (req, res) => {
  res.render('auth/update-password.ejs')
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

exports.auth_deleteProfileById = async (req, res) => {
  try {
    await Auth.findByIdAndDelete(req.params.id)
    res.render('./user/confirm.ejs')
  } catch (error) {
    console.error('An error has occured')
  }
}

exports.auth_signout_get = (req, res) => {
  req.session.destroy()
  res.redirect("/")
}

exports.profile_get = async (req, res) => {
  const user = await User.findById(req.params.userId)
  const posts = await Post.find({ username: req.params.userId })
  const follows = await Follow.findOne({ userId: req.params.userId })
  let followersId = []
  let followingId = []
  if (follows) {
    if (follows.followersId) {
      followersId = follows.followersId
    }
    if (follows.followingId) {
      followingId = follows.followingId
    }
  }
  res.render("users/profile", {
    user,
    posts: posts,
    followerCount: followersId.length,
    followingCount: followingId.length,
  })
}
