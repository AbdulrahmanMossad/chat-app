import { createContext, useContext, useState } from "react"
export const AuthContext = createContext()

export const AuthUseContext = () => {
  return useContext(AuthContext)
}
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  )
  const [lastMessageContext, setLastMessageContext] = useState(
    JSON.parse(localStorage.getItem("last-message")) || []
  )
  // console.log(lastMessageContext)
  const [messageContext, setMessageContext] = useState([])
  const [lastMessageSeen, setLastMessageSeen] = useState(false)
  const [conversationsContext, setConversationsContext] = useState([])
  const [conversationWith, setConversationWith] = useState(
    JSON.parse(localStorage.getItem("chat")) || null
  )
  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        conversationWith,
        setConversationWith,
        messageContext,
        setMessageContext,
        conversationsContext,
        setConversationsContext,
        lastMessageSeen,
        setLastMessageSeen,
        lastMessageContext,
        setLastMessageContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
