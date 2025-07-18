// imports
const express = require('express')
require('dotenv').config()
const session = require('express-session')
const path = require('path')
const multer = require("multer")




// Initialize app
const app = express()

// Database Configuration
const mongoose = require('./config/db')

// set Port Configuration
const port = process.env.PORT ? process.env.PORT : 3000

// Require MiddleWares
const methodOverride = require('method-override')
const morgan = require('morgan')


// Require passUserToView & isSignedIn middlewares


// use MiddleWares
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))



// Session Configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

//passUserToView middleware


// Root Route
app.get('/', (req, res) => {
  res.send('Your app is connected . . . ')
})

// Require Routers
const commentsRouter = require("./routes/comments")


// use Routers
app.use("/comments", commentsRouter)

// Listener
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

