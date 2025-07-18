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
