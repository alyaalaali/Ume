const Comment = require("./../models/comment")
const Post = require("./../models/post")



exports.comments_index_get = async (req,res)=>{
  let post_commnets = Comment.find({postId: req.params.postId})
  res.send(post_commnets)
}