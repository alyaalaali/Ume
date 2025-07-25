const previousPageHandler = async (req, res, next) => {
  if (req.session.previousPages && !req.originalUrl.includes(".") && req.originalUrl !==  "/previous-page" ) {
    req.session.previousPages.stack.push(req.originalUrl)
    console.log(req.session.previousPages.stack)
  }
  next()
}

module.exports =  previousPageHandler
