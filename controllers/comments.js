const Comment = require("./../models/comment")
const Post = require("./../models/post")

exports.comment_index_get = async (req, res) => {
  const postCommnets = await Comment.find({ postId: req.params.postId })
  res.send(postCommnets)
}

exports.comment_create_post = async (req, res) => {
  req.body.postId = req.params.postId
  req.body.userId = req.session.user.userId
  const newComment = await Comment.create(req.body)

  await Post.findByIdAndUpdate(newComment.postId, {
    $push: { comments: newComment._id },
  })
}

exports.comment_delete_delete = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)

  if (comment.userId.equals(req.session.user.userId)) {
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: comment._id },
    })

    await Comment.findByIdAndDelete(comment._id)
    res.send("Your comment has been deleted successfully !")
  } else {
    res.send("Unauthorized action")
  }
}

exports.comment_update_put = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)
  if (comment.userId.equals(req.session.user.userId)) {
    comment.description = req.body.description
    await comment.save()
    res.send("Your comment has been edited successfully")
  } else {
    res.send("Unauthorized action")
  }
}
