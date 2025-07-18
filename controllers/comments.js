const Comment = require("./../models/comment")
const Post = require("./../models/post")



exports.comments_index_get = async (req,res)=>{
  let post_commnets = Comment.find({postId: req.params.postId})
  res.send(post_commnets)
}

exports.comments_create_post = async (req,res)=>{
  req.body.postId = req.params.postId
  req.body.userId = req.session.userId
  await Comment.create(req.body)
}