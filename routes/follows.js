const router = require("express").Router()
const followsCtrl = require("./../controllers/follows")

router.get("/followings/:userId", followsCtrl.following_index_get)
router.get("/followers/:userId/", followsCtrl.follower_index_get)
router.post("/followings/:userId", followsCtrl.follow_create_post)
router.delete("/followers/:userId", followsCtrl.follow_delete_delete)

module.exports = router
