const router = require("express").Router()
const followsCtrl = require("./../controllers/follows")

router.get("/follows/followings/:userId", followsCtrl.following_index_get)
router.get("/follows/followers/:userId", followsCtrl.follower_index_get)
module.exports = router
