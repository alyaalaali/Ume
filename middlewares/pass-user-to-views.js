const passUserToViews = async (req, res, next) => {
  ////////////// This is the real Middleware but it can not be used yet  //////////////
  // res.locals.user = req.session.user? req.session.user: null

  //////// This is a temp code to generate dummy users ////////
  const User = require("./../models/user")
  let dummyUser = await User.findById("687b38aa13bcc3d3e2048ab4")

  res.locals.user = {
    userId: "687b38aa13bcc3d3e2048ab4",
    username: dummyUser.username,
    displayName: dummyUser.displayName,
  }
  
  req.session.user = res.locals.user
  next()
}

module.exports = passUserToViews
