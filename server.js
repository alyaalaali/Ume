// imports
const express = require("express")
require("dotenv").config()
const session = require("express-session")
const path = require("path")
const multer = require("multer")

// Initialize app
const app = express()

// Database Configuration
const mongoose = require("./config/db")

app.engine("html", require("ejs").renderFile)
app.set("view engine", "ejs")
// got a rendering issue? solved it with
// https://stackoverflow.com/questions/23595282/error-no-default-engine-was-specified-and-no-extension-was-provided

// set Port Configuration
const port = process.env.PORT ? process.env.PORT : 3000

// Session Configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
// Require MiddleWares
const isSignIn = require("./middlewares/is-signin.js")
const methodOverride = require("method-override")
const morgan = require("morgan")
const passUserToViews = require("./middlewares/pass-user-to-views.js")
// const createDummyUser = require('./middlewares/create-dummy-user.js')

// Require passUserToView & isSignedIn middlewares

// use MiddleWares
app.use(passUserToViews)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(express.static(path.join(__dirname, "public")))

//passUserToView middleware

// Require Routers
const authRouter = require("./routes/auth.js")
const postRouter = require("./routes/postRouter.js")
const commentsRouter = require("./routes/comments.js")
// const followRouter = require("./routes/follows.js")

// use Routers
app.use("/users", authRouter)
app.use(isSignIn)
app.use("/posts", postRouter)
app.use("/comments", commentsRouter)
app.use("/follows", authRouter)



app.get("/", async (req, res) => {
  const Post = require("./models/post.js")
  const allPosts = await Post.find({})
    .populate("userId")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username displayName ",
      },
    })
    
    const userId = req.session.user._id

    const postwithlike = allPosts.map((post) => {
      const isliked = post.favoritedByUser.some((user) => user.equals(userId)
    )
    post = post.toObject()
    post.userHasFavorited = isliked
    return post
    })
    res.render("posts/timeline.ejs", { pageName: "Timeline",
    allPosts: postwithlike , user: req.session.user})
})

// Listener
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
