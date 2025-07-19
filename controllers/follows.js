const User = require("./../models/user")
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

exports.follow_create_post = async (req, res) => {
  try {
    const followedUserId = req.params.userId
    const user = req.session.user.userId

    await Follow.findByIdAndUpdate(followedUserId, {
      $push: { followersId: user },
    })

    await Follow.findByIdAndUpdate(user, {
      $push: { followingId: followedUserId },
    })
  } catch {
    res.status(500).json({ error: "failed to follow user!" })
  }
}

exports.follow_delete_delete = async (req, res) => {
  try {
    const unfollowedUserId = req.params.userId
    const user = req.session.user.userId

    await Follow.findByIdAndUpdate(unfollowedUserId, {
      $pull: { followersId: user },
    })

    await Follow.findByIdAndUpdate(user, {
      $pull: { followingId: unfollowedUserId },
    })
  } catch {
    res.status(500).json({ error: "failed to unfollow user!" })
  }
}
