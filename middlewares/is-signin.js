const isSignedIn = (req, res, next) => {
  if (req.session.user) return next()
  res.render("index.ejs")
}

module.exports = isSignedIn
