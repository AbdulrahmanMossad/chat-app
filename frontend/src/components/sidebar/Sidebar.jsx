import ConversationHook from "../../hook/conversations/conversationHook"
import Conversations from "./Conversations"
import LogOut from "./LogOut"
import SearchInput from "./SearchInput"

function Sidebar() {
  const [conversations] = ConversationHook()
  return (
    <div className="flex flex-col w-full ">
      <SearchInput conversations={conversations} />
      <div className=" pt-6 "></div>
      <Conversations  />
      <LogOut />
    </div>
  )
}

export default Sidebar
