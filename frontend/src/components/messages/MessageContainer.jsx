import { useEffect, useState } from "react"
import { TiMessages } from "react-icons/ti"
import { IoMdArrowRoundBack } from "react-icons/io"
import { useParams } from "react-router-dom"
import Messages from "./Messages"
import MessageInput from "./MessageInput"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import GetMessages from "../../hook/messages/getMessages"

// import { AuthUseContext } from "../../context/AuthContext"
function MessageContainer() {
  const { id } = useParams()
  const [x, setX] = useState([])
  const [messages, , , , loadingg] = GetMessages(id)
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }
  const [conversationWith, setConversationWith] = useState(null)

  const [selectedConversation, setSelectedConversation] = useState(true)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const run = async () => {
      setLoading(true)
      await axios
        .get(`https://chat-app-iduc.onrender.com/api/v1/users/${id}`, {
          withCredentials: true,
        })
        .then(async (res) => {
          setConversationWith(res)
          console.log(res.data.results[0].fullName)
        })
        .catch((err) => {
          console.log(err)
        })
      setLoading(false)
    }
    run()
  }, [])

  return (
    <div className="flex flex-col w-full">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="bg-gray-900 px-4 py-2 mb-2 flex items-center gap-2">
            <IoMdArrowRoundBack
              className="text-gray-500 cursor-pointer"
              onClick={handleGoBack}
            />
            <span className="label-text text-gray-400">To: </span>{" "}
            <span className="text-gray-300 font-bold">
              {conversationWith?.data.results[0].fullName}
            </span>
          </div>
          <Messages conversationWith={conversationWith} loadingg={loadingg} />
          <MessageInput />
        </>
      )}
    </div>
  )
}

export default MessageContainer
const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 Abdulrahman</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  )
}
