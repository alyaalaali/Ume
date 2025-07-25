const previousPageHandler = async (req, res, next) => {
  if (
    req.session.previousPages &&
    !req.originalUrl.includes(".") &&
    req.originalUrl !== "/previous-page" &&
    req.method === "GET" &&
    !req.originalUrl.includes("_method")
  ) {
    if (
      req.session.previousPages.stack.length >= 0 &&
      req.session.previousPages.stack[
        req.session.previousPages.stack.length - 1
      ] !== req.originalUrl
    ) {
      req.session.previousPages.stack.push(req.originalUrl)
      console.log(req.session.previousPages.stack)
    }
  }
  next()
}

module.exports = previousPageHandler
