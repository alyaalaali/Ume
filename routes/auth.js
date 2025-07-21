const router = require("express").Router()
const authCtrl = require("../controllers/auth")

// Routes - Call API's

router.get("/sign-up", authCtrl.auth_signup_get)
router.post("/sign-up", authCtrl.auth_signup_post)

router.get("/sign-in", authCtrl.auth_signin_get)
router.post("/sign-in", authCtrl.auth_signin_post)

router.get("/sign-out", authCtrl.auth_signout_get)

router.put("/:id", authCtrl.auth_updatePassword)

router.get("/:userId", authCtrl.profile_get)
router.post("/:userId/follow", authCtrl.follow_create_post)
router.delete("/:userId/unfollow", authCtrl.follow_delete_delete)

router.get("/search", authCtrl.search_get)
router.post("/search", authCtrl.search_post)
module.exports = router
