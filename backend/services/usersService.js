const User = require("../models/userModel")
const Conversation = require("../models/conversationMode")
// exports.getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedUser = req.user._id
//     const users = await User.find({ _id: { $ne: loggedUser } }).select(
//       "-password"
//     )
//     res.status(200).json({ results: users.length, users })
//   } catch (err) {
//     console.log("Error in getUsersForSidebar", err.message)
//     res.status(500).json({ error: "Internal Server Error" })
//   }
// }

exports.getUsersForSidebar = async (req, res) => {
  try {
    const loggedUser = req.user._id

    // Fetch users excluding the logged in user
    const users = await User.find({ _id: { $ne: loggedUser } }).select(
      "-password"
    )

    // Array to store modified users with last message details
    const usersWithLastMessage = []

    // Loop through each user to find the last message
    for (let user of users) {
      const conversation = await Conversation.findOne({
        participants: { $all: [loggedUser, user._id] },
      }).populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Sort messages by createdAt in descending order, limit to 1
      })

      // Extract last message details
      let lastMessage = null
      if (conversation && conversation.messages.length > 0) {
        lastMessage = conversation.messages[0]
      }

      // Prepare user object with last message details
      usersWithLastMessage.push({
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
        lastMessage: lastMessage ? lastMessage.message : null,
        lastMessageCreatedAt: lastMessage ? lastMessage.createdAt : null,
      })
    }

    // Sort users based on the timestamp of the last message
    usersWithLastMessage.sort((a, b) => {
      if (!a.lastMessageCreatedAt) return 1 // If user A has no last message, it comes after B
      if (!b.lastMessageCreatedAt) return -1 // If user B has no last message, it comes after A
      return b.lastMessageCreatedAt - a.lastMessageCreatedAt // Sort by last message createdAt descending
    })

    res.status(200).json({
      results: usersWithLastMessage.length,
      users: usersWithLastMessage,
    })
  } catch (err) {
    console.error("Error in getUsersForSidebar", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

exports.getSpecificUser = async (req, res) => {
  try {
    const { id } = req.params
    // console.log(id)
    const user = await User.find({ _id: id }).select("-password")
    if (user) {
      res.status(200).json({ results: user })
    } else {
      res.status(404).json({ message: "no user" })
    }
  } catch (err) {
    console.log("Error in get one User", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
