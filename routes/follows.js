const router = require("express").Router()
const followsCtrl = require("./../controllers/follows")

router.get("/follows/followings/:userId", followsCtrl.following_index_get)
router.get("/follows/followers/:userId/", followsCtrl.follower_index_get)
router.post("follows/followings/:userId", followsCtrl.follow_create_post)
router.delete("/follows/followers/:userId", followsCtrl.follow_delete_delete)

module.exports = router
