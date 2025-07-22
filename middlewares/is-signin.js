const isSignedIn = (req, res, next) => {
  if(req.session.user) return next()
    res.redirect("/users/sign-in")
}

module.exports = isSignedIn