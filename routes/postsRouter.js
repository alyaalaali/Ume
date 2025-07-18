const router = require("express").Router()

const postCtrl = require("../controllers/postsCtrl.js")

// Routes / call API's

router.get("/", postCtrl.post_create_get)

module.exports = router