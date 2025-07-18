const Comment = require("./../models/comment")
const Post = require("./../models/post")



exports.comments_index_get = async (req,res)=>{
  const post_commnets = await Comment.find({postId: req.params.postId})
  res.send(post_commnets)
}

exports.comments_create_post = async (req,res)=>{
  req.body.postId = req.params.postId
  req.body.userId = req.session.userId
  await Comment.create(req.body)
}

exports.comments_update_put = async (req,res)=>{
  const comment = awaitComment.findById(req.params.commentId)

  if (comment.userId.equals(req.session.user._id)){
    comment.set(req.body)
    await comment.save()
  }
}