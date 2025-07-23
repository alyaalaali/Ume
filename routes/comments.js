const router = require("express").Router()
const commentsCtrl = require("./../controllers/comments")
const Comment = require("./../models/comment")

router.post("/:commentId/like", commentsCtrl.like_create_post)
router.delete("/:commentId/unlike", commentsCtrl.like_delete_destroy)

router.get("/:postId", commentsCtrl.comment_index_get)
router.post("/:postId", commentsCtrl.comment_create_post)
router.put("/:commentId", commentsCtrl.comment_update_put)
router.delete("/:commentId", commentsCtrl.comment_delete_delete)

module.exports = router
