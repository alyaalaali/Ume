const { post } = require("../routes/comments")
const Comment = require("./../models/comment")
const Post = require("./../models/post")

exports.comment_index_get = async (req, res) => {
  const postComments = await Comment.find({
    postId: req.params.postId,
  }).populate("userId")

  res.render("./comments/index.ejs", {
    pageName: "Comments",
    postComments,
    currentPostId: req.params.postId,
  })
}

exports.comment_create_post = async (req, res) => {
  req.body.postId = req.params.postId
  req.body.userId = req.session.user._id
  const newComment = await Comment.create(req.body)

  await Post.findByIdAndUpdate(newComment.postId, {
    $push: { comments: newComment._id },
  })

  res.redirect(`/comments/${req.params.postId}`)
}

exports.comment_delete_delete = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)

  if (comment.userId.equals(req.session.user._id)) {
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: comment._id },
    })

    await Comment.findByIdAndDelete(comment._id)
    res.redirect(req.get("referer"))
  } else {
    res.redirect(req.get("referer"))
  }
}

exports.comment_update_put = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)
  if (comment.userId.equals(req.session.user._id)) {
    comment.description = req.body.description
    await comment.save()
    res.redirect(req.get("referer"))
  } else {
    res.redirect(req.get("referer"))

  }
}

exports.like_create_post = async (req, res) => {

  await Comment.findByIdAndUpdate(req.params.commentId, {
    $push: {
      favoritedByUser: req.session.user._id,
    },
  })
  res.redirect(req.get("referer"))
}

exports.like_delete_destroy = async (req, res) => {
  await Comment.findByIdAndUpdate(req.params.commentId, {
    $pull: {
      favoritedByUser: req.session.user._id,
    },
  })
  res.redirect(req.get("referer"))
}
