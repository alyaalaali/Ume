const router = require("express").Router()
const commentsCtrl = require("./../controllers/comments")
const Comment = require("./../models/comment")




router.get("/:postId", commentsCtrl.comments_index_get)
router.post("/:postId", commentsCtrl.comments_create_post)
router.put("/:commentId", commentsCtrl.comments_update_put)
router.delete("/:commentId", commentsCtrl.comments_delete_delete)





module.exports = router