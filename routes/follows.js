const router = require("express").Router()
const followsCtrl = require("./../controllers/follows")

router.get("/follows/:userId/followings/", followsCtrl.following_index_get)
router.get("/follows/:userId/followers/", followsCtrl.follower_index_get)
router.post("follows/:userId/follow", followsCtrl.follow_create_post)
router.delete("/follows/:userId/unfollow", followsCtrl.follow_delete_delete)

module.exports = router
