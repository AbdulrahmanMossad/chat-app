const Conversation = require("../models/conversationMode")
const Message = require("../models/messageModel")
const { getReciverSocketId, io } = require("../socket/socket")

exports.sendMessageService = async (req, res) => {
  try {
    const receiverId = req.params.id
    const message = req.body.message
    const senderId = req.user._id
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      })
    }
    const newMessage = await Message.create({ receiverId, message, senderId })
    await Conversation.updateOne(
      { _id: conversation._id },
      { $push: { messages: newMessage._id } }
    )
    //if reciver user is online send message to him using socket.io
    const reciverSocketId = getReciverSocketId(receiverId)
    if (reciverSocketId) {
      io.to(reciverSocketId).emit(
        "newMessage",
        newMessage,
        receiverId,
        senderId,
        false
      )
    }

    // await Conversation.messages.push(newMessage._id)
    res.status(200).json({ message: newMessage })
  } catch (error) {
    console.log("Error in sending message", error.message)
    res.status(500).json({ message: "InternalServer Error" })
  }
}
exports.getMessageService = async (req, res) => {
  try {
    const loggedUser = req.user._id
    const personId = req.params.id //person that i chat with

    await Message.updateMany(
      { senderId: personId, receiverId: loggedUser },
      { seen: true },
      { new: true }
    )

    const conversation = await Conversation.findOne({
      participants: { $all: [loggedUser, personId] },
    }).populate("messages")
    if (!conversation) {
      res.status(200).json([])
    } else {
      const messages = conversation.messages
      const lastmessage = messages[messages.length - 1].message
      const lastMessageSenderId = messages[messages.length - 1].senderId
      const lastMessageSeen = messages[messages.length - 1].seen
      console.log(messages[messages.length - 1].seen)
      //if reciver user is online send message to him using socket.io
      const reciverSocketId = getReciverSocketId(personId)
      if (reciverSocketId) {
        io.to(reciverSocketId).emit("seenMessages", true, loggedUser, personId)
      }
      res
        .status(200)
        .json({ messages, lastmessage, lastMessageSenderId, lastMessageSeen })
    }
  } catch (err) {
    console.log("Error while getting messages", err.message)
    res.status(500).json({ message: "InternalServer Error" })
  }
}

//without update seen for getting last message for home page
exports.getMessageService2 = async (req, res) => {
  try {
    const loggedUser = req.user._id
    const personId = req.params.id //person that i chat with

    const conversation = await Conversation.findOne({
      participants: { $all: [loggedUser, personId] },
    }).populate("messages")

    if (!conversation) {
      res.status(200).json([])
    } else {
      const messages = conversation.messages
      const lastmessage = messages[messages.length - 1].message
      const lastaudio = messages[messages.length - 1].audio
      const lastMessageSenderId = messages[messages.length - 1].senderId
      const lastMessageSeen = messages[messages.length - 1].seen
      // console.log(messages[messages.length - 1].seen)
      //if reciver user is online send message to him using socket.io
      // const reciverSocketId = getReciverSocketId(personId)
      // if (reciverSocketId) {
      //   io.to(reciverSocketId).emit("seenMessages", true, loggedUser, personId)
      // }
      // const reciverSocketId = getReciverSocketId(receiverId)
      // if (reciverSocketId) {
      //   io.to(reciverSocketId).emit("lastMessage", lastmessage)
      // }
      res.status(200).json({
        messages,
        lastmessage,
        lastMessageSenderId,
        lastMessageSeen,
        lastaudio,
      })
    }
  } catch (err) {
    console.log("Error while getting messages", err.message)
    res.status(500).json({ message: "InternalServer Error" })
  }
}

exports.sendAudioMessage = async (req, res) => {
  try {
    const receiverId = req.params.id
    const senderId = req.user._id
    const audioPath = req.file.path

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      })
    }
    const newMessage = new Message({
      senderId: req.user._id,
      receiverId: receiverId,
      message: "", // Empty message since it's an audio message
      audio: audioPath, // Store audio path
      seen: false,
    })

    await newMessage.save()
    await Conversation.updateOne(
      { _id: conversation._id },
      { $push: { messages: newMessage._id } }
    )
    //if reciver user is online send message to him using socket.io
    const reciverSocketId = getReciverSocketId(receiverId)
    if (reciverSocketId) {
      io.to(reciverSocketId).emit(
        "newAudioMessage",
        newMessage,
        receiverId,
        senderId,
        false
      )
    }

    res.status(201).json({
      message: newMessage,
    })
  } catch (error) {
    console.error("Error sending audio message:", error)
    res.status(500).json({
      success: false,
      error: "Server error",
    })
  }
}
