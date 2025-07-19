const createDummyUser = async (req, res, next) => {
  const User = require("./../models/user")

  if (await User.findOne({})) {
    const existingDummy = await User.findOne({})
    req.session.user = {
      userId: existingDummy._id,
      displayName: existingDummy.displayName,
      username: existingDummy.username,
    }
  } else {
    const newDummy = await User.create({
      username: "dummyUser",
      password: "dummyUser",
      displayName: "dummyUser",
    })

    req.session.user = {
      userId: newDummy._id,
      password: "dummyUser",
      displayName: "dummyUser",
    }
  }

  next()
}

module.exports = createDummyUser
