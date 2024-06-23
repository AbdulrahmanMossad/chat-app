import { useEffect, useRef } from "react"
import Message from "./Message"
import MessageSkeleton from "../skeletons/MessageSkeleton"
import { TiMessages } from "react-icons/ti"
import { AuthUseContext } from "../../context/AuthContext"
import { useSocketContext } from "../../context/SocketContext"
import notificationSound from "../../assets/notification.mp3"

function Messages({ conversationWith, loading }) {
  const { messageContext, setMessageContext } =
    AuthUseContext()
  const { socket } = useSocketContext()
  useEffect(() => {
    socket?.on("newMessage", (newMessage, receiverId, senderId) => {
      // console.log(receiverId)
      if (senderId !== conversationWith.data.results[0]._id) {
        return
      }
      newMessage.shouldShake = true
      const sound = new Audio(notificationSound)
      sound.play()
      setMessageContext([...messageContext, newMessage])
      // console.log(messageContext)
    })
    return () => socket?.off("newMessage")
  }, [socket, setMessageContext, messageContext])

  const messagesEndRef = useRef(null)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messageContext])
  // console.log(messageContext)
  return (
    <div className="px-4 flex-1 overflow-auto">
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messageContext && messageContext?.length > 0 ? (
        messageContext?.map((message, index) => (
          <Message
            key={message._id}
            message={message}
            conversationWith={conversationWith}
          />
        ))
      ) : (
        <NoChatSelected conversationWith={conversationWith} />
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default Messages

const NoChatSelected = ({ conversationWith }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 </p>
        <p>Start chat with {conversationWith?.data.results[0].fullName}</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  )
}
