import axios from "axios"
import { useEffect, useState } from "react"

function GetLastMessage(id) {
  const [loading, setLoading] = useState(false)
  const [lastMessage, setLastMessage] = useState("")
  const [lastMessageSenderId, setLastMessageSenderId] = useState(null)
  const [lastMessageSeen, setLastMessageSeen] = useState(false)
  const [messages, setMessages] = useState(false)
  const [lastAudio, setLastAudio] = useState("")

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `https://chat-app-iduc.onrender.com/api/v1/messages/last/${id}`,
          {
            withCredentials: true, // Ensure cookies are sent with the request
          }
        )

        const { lastmessage, lastMessageSeen, lastMessageSenderId, lastaudio } =
          res.data
        // console.log(lastaudio)
        setLastMessage(lastmessage)
        setLastMessageSenderId(lastMessageSenderId)
        setLastMessageSeen(lastMessageSeen)
        setMessages(res)

        setLastAudio(lastaudio)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [id])

  return [
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
  ]
}

export default GetLastMessage
