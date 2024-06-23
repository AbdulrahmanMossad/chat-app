import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AuthUseContext } from "../../context/AuthContext"

function GetMessages(id) {
  const { setMessageContext } = AuthUseContext()
  const [loadingg, setLoadingg] = useState(false)
  const [lastMessage, setLastMessage] = useState("")
  const [lastMessageSenderId, setLastMessageSenderId] = useState(null)
  const [lastMessageSeen, setLastMessageSeen] = useState(false)
  const [messages, setMessages] = useState(false)

  useEffect(() => {
    const run = async () => {
      setLoadingg(true)
      await axios
        .get(`https://chat-app-iduc.onrender.com/api/v1/messages/${id}`, {
          withCredentials: true, // Ensure cookies are sent with the request
        })
        .then((res) => {
          // console.log(res.data.lastMessageSeen)
          setLastMessage(res?.data?.lastmessage)
          setLastMessageSenderId(res?.data?.lastMessageSenderId)
          setLastMessageSeen(res?.data?.lastMessageSeen)
          setMessages(res)
          setMessageContext(res?.data?.messages)
          // console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
      setLoadingg(false)
    }
    run()
  }, [id])
  return [
    messages,
    lastMessage,
    lastMessageSenderId,
    lastMessageSeen,
    loadingg,
    setMessages,
  ]
}

export default GetMessages
