const router = require("express").Router()
const authCtrl = require("../controllers/auth")

// Routes - Call API's

//auth routes
router.get("/sign-up", authCtrl.auth_signup_get)
router.post("/sign-up", authCtrl.auth_signup_post)

router.get("/sign-in", authCtrl.auth_signin_get)
router.post("/sign-in", authCtrl.auth_signin_post)

router.get("/sign-out", authCtrl.auth_signout_get)
router.get("/search", authCtrl.search_get)
router.post("/search", authCtrl.search_post)

//profile routes
router.get("/update-password", authCtrl.auth_updatePassword_get)
router.put("/:id", authCtrl.auth_updatePassword_post)
router.get("/:id/profile/edit", authCtrl.auth_updateProfileById_get)
router.put("/:id/profile/", authCtrl.auth_updateProfileById_put)
router.delete("/:id", authCtrl.auth_deleteProfileById_delete)
router.get("/:userId", authCtrl.profile_get)
router.post("/:userId/follow", authCtrl.follow_create_post)
router.delete("/:userId/unfollow", authCtrl.follow_delete_delete)

//follow routes
router.get("/followings/:userId", authCtrl.following_index_get)
router.get("/followers/:userId/", authCtrl.follower_index_get)

module.exports = router
