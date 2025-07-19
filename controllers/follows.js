const Follow = require("./../models/follower")

exports.following_index_get = async (req, res) => {
  try {
    const userId = req.params.userId
    const followingList = await Follow.findById({ userId }).populate({
      path: "followingId", //
      select: "username displayName",
    })
    res.send(followingList)
  } catch (error) {
    res.status(500).json({ error: "failed to get the followings list!" })
  }
}

exports.follower_index_get = async (req, res) => {
  try {
    const userId = req.params.userId
    const followersList = await Follow.findOne({ userId }).populate({
      path: "followersId", //
      select: "username displayName",
    })
    res.send(followerList)
  } catch (error) {
    res.status(500).json({ error: "failed to get the followers list!" })
  }
}
