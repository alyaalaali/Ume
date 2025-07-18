const router = require("express").Router()

const postCtrl = require("../controllers/postsCtrl.js")

// Routes / call API's

router.get("/", postCtrl.post_index_get)
router.get("/new", postCtrl.post_create_get)
router.post("/:userId", postCtrl.post_create_post)
router.get("/:id", postCtrl.post_show_get)

module.exports = router