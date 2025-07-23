const router = require("express").Router()
const multer = require("../config/multer.js")
const postCtrl = require("../controllers/postsCtrl.js")
// Routes / call API's

router.get("/", postCtrl.post_index_get)
router.get("/new", postCtrl.post_create_get)
router.post("/:userId", multer.single("photo"), postCtrl.post_create_post)
router.get("/:id", postCtrl.post_show_get)
router.get("/:id/edit", postCtrl.post_edit_get)
router.put("/:id", multer.single("photo"), postCtrl.post_update_put)
router.delete("/:id", postCtrl.post_delete_destroy)

router.post("/:postId/favorited-by/:userId", postCtrl.fav_create_post)

module.exports = router
