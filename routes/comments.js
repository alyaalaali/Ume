const router = require("express").Router()
const commentsCtrl = require("./../controllers/comments")
const Comment = require("./../models/comment")



router.get("/:postId", commentsCtrl.comments_index_get)
router.post("/:postId", commentsCtrl.comments_create_post)





module.exports = router