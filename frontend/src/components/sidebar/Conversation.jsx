import { AuthUseContext } from "../../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons"
import GetLastMessage from "../../hook/messages/getLastMessage"
import { useSocketContext } from "../../context/SocketContext"
import { useEffect, useState } from "react"
import notificationSound from "../../assets/notification.mp3"
import { MdPlayArrow, MdPause } from "react-icons/md"
function Conversation({ conversation, lastIndex, index, setSelected, style }) {
  const [
    messages,
    lastMessage,
    lastMessageSenderId,
    lastMessageSeen,
    loading,
    setLastMessage,
    setLastMessageSenderId,
    setLastMessageSeen,
    lastAudio,
    setLastAudio,
  ] = GetLastMessage(index)

  const { onlineUsers } = useSocketContext()
  const isOnline = onlineUsers.includes(conversation._id)
  const { conversationWith, setConversationWith } = AuthUseContext()
  const { socket } = useSocketContext()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00") // Placeholder for current time

  // Calculate total duration for demonstration purposes (replace with actual logic)
  const totalDuration = "03:45"
  useEffect(() => {
    const handleNewMessage = (newMessage, receiverId, senderId, seen) => {
      if (senderId === conversation._id) {
        newMessage.shouldShake = true
        const sound = new Audio(notificationSound)
        sound.play()
        setLastMessage(newMessage.message)
        setLastAudio("")
        setLastMessageSenderId(senderId)
        setLastMessageSeen(seen)
      }
    }

    socket?.on("newMessage", handleNewMessage)

    return () => {
      socket?.off("newMessage", handleNewMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    socket,
    conversation._id,
    setLastMessage,
    setLastMessageSenderId,
    setLastMessageSeen,
  ])
  useEffect(() => {
    const handleNewMessage = (newMessage, receiverId, senderId, seen) => {
      // console.log(newMessage.audio)
      if (senderId === conversation._id) {
        // console.log("hi frome audio")
        newMessage.shouldShake = true
        const sound = new Audio(notificationSound)
        sound.play()
        setLastAudio(newMessage.audio)
        setLastMessage("")
        setLastMessageSenderId(senderId)
        setLastMessageSeen(seen)
      }
    }

    socket?.on("newAudioMessage", handleNewMessage)

    return () => {
      socket?.off("newAudioMessage", handleNewMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    socket,
    conversation._id,
    setLastMessageSenderId,
    setLastMessageSeen,
    setLastAudio,
  ])
  //handle seen
  useEffect(() => {
    const handleNewMessage = (seen, loggedUser, personId) => {
      if (loggedUser === conversation._id) {
        setLastMessageSeen(seen)
        // setLastMessageSenderId(senderId)
      }
    }

    socket?.on("seenMessages", handleNewMessage)

    return () => {
      socket?.off("seenMessages", handleNewMessage)
    }
  }, [socket, conversation._id, setLastMessageSeen])
  const handleChat = () => {
    setSelected(conversation._id)
    setConversationWith(conversation)
    localStorage.setItem("chat", JSON.stringify(conversation))
    location.href = `/messages/${conversation._id}`
  }

  const renderLastMessage = () => {
    if (!lastMessage && !lastAudio) {
      // console.log(lastAudio)
      return "say hi ! 👋"
    }
    if (!lastMessage && lastAudio) {
      setLastMessage(
        <div className="flex items-center">
          <button className="text-white">
            {isPlaying ? (
              <MdPause className="text-white" />
            ) : (
              <MdPlayArrow className="text-white" id="audio" />
            )}
          </button>
          <div className="voice-message bg-gray-700 p-2 rounded-lg flex items-center space-x-2 ">
            <div className="text-xs text-gray-400 w-full flex items-center">
              <div className="bg-gray-400 h-2 relative w-full rounded-lg">
                <div
                  className="bg-white h-full rounded-lg"
                  style={{ width: "30%" }} // Example width, replace with dynamic width based on currentTime
                ></div>
              </div>
              <span className=" ">
                <div className="text-xs text-gray-400 w-10 flex justify-center border-b border-gray-400">
                  {/* Remove "00:00" text */}
                </div>
              </span>
            </div>
          </div>
        </div>
      )

      return lastMessage
    }

    const truncatedMessage =
      lastMessage.length > 20 ? lastMessage.slice(0, 20) + "..." : lastMessage

    if (lastMessageSenderId === conversation._id) {
      return <>{truncatedMessage}</>
    } else {
      if (lastMessageSeen === false) {
        return (
          <div className="flex items-center gap-2">
            {truncatedMessage}
            <FontAwesomeIcon icon={faCheckDouble} className="" />
          </div>
        )
      } else {
        return (
          <div className="flex items-center gap-2">
            {truncatedMessage}
            <FontAwesomeIcon
              icon={faCheckDouble}
              className="delivered-icon read-icon"
            />
          </div>
        )
      }
    }
  }

  return (
    <>
      <div
        className={`flex gap-4 items-center rounded-full cursor-pointer ${style}`}
        onClick={handleChat}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-14 rounded-full">
            <img src={conversation.profilePic} alt="Profile" />
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <p className="text-gray-300">{conversation.username}</p>
          <h5
            className={`truncate max-w-xs ${
              !lastMessage
                ? "text-gray-700"
                : (lastMessageSenderId === conversation._id &&
                    lastMessageSeen) ||
                  lastMessageSenderId !== conversation._id
                ? "text-gray-700"
                : "text-white"
            }`}
          >
            {renderLastMessage()}
          </h5>
        </div>
      </div>
      {lastIndex ? null : <div className="divider px-3"></div>}
    </>
  )
}

export default Conversation
