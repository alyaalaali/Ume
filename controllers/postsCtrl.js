const Post = require("../models/post.js")

// API's

exports.post_index_get = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username displayName",
      },
    })
    res.status(200).render("posts/index.ejs", { posts , pageName: "Explorer"})
  } catch (error) {
    res.status(500).json({ error: "Page not found!" })
  }
}

exports.post_create_get = async (req, res) => {
  try {
    res.status(200).render("posts/new.ejs", {
      pageName: "Create Post"
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to render new page!" })
  }
}

exports.post_create_post = async (req, res) => {
  try {
    const postData = {
      photo: `${req.file.filename}`,
      caption: req.body.caption,
      userId: req.session.user._id,
    }
    await Post.create(postData)
    res.redirect("/posts")
  } catch (error) {
    res.status(500).json({ error: "Failed to create post!" })
  }
}

exports.post_show_get = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      select: "username displayName photo",
    })
    
    res.status(200).render("posts/show.ejs", { post , pageName: "Post"})
  } catch (error) {
    res.status(500).json({ error: "Failed to show specific post!" })
  }
}

exports.post_edit_get = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      select: "username displayName",
    })
    if (req.session.user && post.userId._id.equals(req.session.user._id)) {
      res.status(200).render("posts/edit.ejs", { post })
    } else {
      res.status(403).send("You are not allowed to edit this post.")
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to render edit page!" })
  }
}

exports.post_update_put = async (req, res) => {
  try {
    // req.body.photo = `${req.file.filename}`
    const post = await Post.findById(req.params.id)
    post.caption = req.body.caption
    await post.save()
    // const post = await Post.findByIdAndUpdate(req.params.id, req.body.caption)
    res.redirect(`/posts/${post._id}`)
  } catch (error) {
    console.log("err", error)
    res.status(500).json({ error: "Failed to edit post!" })
  }
}

exports.post_delete_destroy = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.status(200).redirect("/posts")
  } catch {
    res.status(500).json({ error: "Failed to destroy post!" })
  }
}

exports.fav_create_post = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { favoritedByUser : req.params.userId}
    })
    res.redirect(`/posts/${req.params.postId}`)
  } catch (error) {

  }
}