import { useState } from "react"
import Conversation from "./Conversation"

import { AuthUseContext } from "../../context/AuthContext"

function Conversations() {
  const { conversationsContext, setConversationsContext } = AuthUseContext()
  // const [messages,lastMessage] = GetMessages()
  const [selected, setSelected] = useState("")
  // console.log(conversations)

  return (
    <div className="flex flex-col py-2 px-1 overflow-auto h-full">
      {conversationsContext && conversationsContext?.length > 0
        ? conversationsContext.map((conversation, index) => (
            <Conversation
              key={conversation._id}
              // lastMessage={GetMessages(conversation._id)}
              conversation={conversation}
              lastIndex={index === conversationsContext.length - 1}
              index={conversation._id}
              setSelected={setSelected}
              style={
                selected === conversation._id
                  ? "bg-gray-800"
                  : "hover:bg-gray-900"
              }
            />
          ))
        : null}
    </div>
  )
}

export default Conversations
