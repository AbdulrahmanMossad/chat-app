import MessageContainer from "../../components/messages/MessageContainer"
function MessagesPage() {
  return (
    <div className="flex h-screen sm:h-[80%]  w-[100%] sm:w-[80%] lg:w-[60%] rounded-lg backdrop-filter backdrop-blur-lg opacity-1 bg-clip-padding  bg-gray-950  overflow-hidden">
      <MessageContainer />
    </div>
  )
}

export default MessagesPage
