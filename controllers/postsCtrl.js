const Post = require("../models/post.js")

// API's

exports.post_index_get = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username displayName"
      }
    })
    res.status(200).render("posts/index.ejs", { posts })
  } catch (error) {
    res.status(500).json({ error: "Page not found" })
  }
}

exports.post_create_get = async (req, res) => {
  try {
    res.status(200).render("posts/new.ejs")
  } catch (error) {
    res.status(500).json({ error: "Failed to spawn new page" })
  }
}

exports.post_create_post = async (req, res) => {
  try {
    const postData = {
      photo: req.body.photo,
      caption: req.body.caption,
      userId: req.session.userId
    }

    await Post.create(postData)
    res.redirect("/posts")
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" })
  }
}

exports.post_show_get = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      select: "username displayName"
    })
    res.status(200).render("show.ejs", { post })
  } catch (error) {
    res.status(500).json({ error: "Failed to show specific post" })
  }
}
