const User = require("./../models/user")
const Follow = require("./../models/follower")

exports.following_index_get = async (req, res) => {
  try {
    const userId = req.params.userId
    const following = await Follow.findOne({ userId }).populate("followingId")

    const data = {
      followingList: [],
      followersList: [],
    }
    if (following && following.followingId) {
      data.followingList = following.followingId
    }

    res.render("users/follow", data)
  } catch (error) {
    res.status(500).json({ error: "failed to get the followings list!" })
  }
}

exports.follower_index_get = async (req, res) => {
  try {
    const userId = req.params.userId
    const followers = await Follow.findOne({ userId }).populate("followersId")
    const data = {
      followersList: [],
      followingList: [],
    }
    if (followers && followers.followersId) {
      data.followersList = followers.followersId
    }
    res.render("users/follow", data)

  } catch (error) {
    res.status(500).json({ error: "failed to get the followers list!" })
  }
}
