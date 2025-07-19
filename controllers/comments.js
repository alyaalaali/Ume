const Comment = require("./../models/comment")
const Post = require("./../models/post")



exports.comment_index_get = async (req, res) => {
  const postCommnets = await Comment.find({ postId: req.params.postId })
  res.send(postCommnets) 
}

exports.comment_create_post = async (req, res) => {
  req.body.postId = req.params.postId
  req.body.userId = req.session.user._id
  const newComment = await Comment.create(req.body)

  Post.findByIdAndUpdate(req.body.postId, {
    $push: { comments: newComment._id },
  })
}

exports.comment_update_put = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)

  if (comment.userId.equals(req.session.user._id)) {
    comment.set(req.body)
    await comment.save()
    res.send("Comment created successfully")
  } else {
    res.send("ur not the comment owner")
  }
}

exports.comment_delete_delete = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)

  if (comment.userId.equals(req.session.user._id)) {
    await Post.findByIdAndUpdate(req.body.postId, {
      $pull: { comments: comment._id },
    })
    await Post.findByIdAndDelete(req.body.postId)
    res.send("The comment has been deleted successfully")
  } else {
    res.send("ur not the comment owner")
  }
}
