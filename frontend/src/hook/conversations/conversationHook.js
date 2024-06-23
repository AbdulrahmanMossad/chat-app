import axios from "axios"
import { useEffect, useState } from "react"
import { AuthUseContext } from "../../context/AuthContext"
// import Cookies from "js-cookie"

function ConversationHook() {
  const { conversationsContext, setConversationsContext } = AuthUseContext()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      await axios
        .get("https://chat-app-iduc.onrender.com/api/v1/users", {
          withCredentials: true, // Ensure cookies are sent with the request
        })
        .then((res) => {
          setConversations(res?.data?.users) // Use res.data instead of res.json()
          setConversationsContext(res?.data?.users)
          // console.log(res.data.users)
        })
        .catch((err) => {
          console.log(err)
        })
      setLoading(false)
    }
    run()
  }, [])

  return [conversations, loading]
}

export default ConversationHook
