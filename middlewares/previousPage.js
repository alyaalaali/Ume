const previousPageHandler = (req, res, next) => {
  // console.log("pagesStack", req.session.pagesStack)
  req.session.pagesStack = req.session.pagesStack
    ? req.session.pagesStack[req.session.pagesStack.length] = req.originalUrl
    : new Array()

  console.log(req.session.pagesStack?typeof req.session.pagesStack :"",req.session.pagesStack?req.session.pagesStack :"")
  next()
}

module.exports = previousPageHandler
