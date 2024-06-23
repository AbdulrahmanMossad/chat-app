import { createContext, useContext, useEffect, useState } from "react"
import { AuthUseContext } from "./AuthContext"
import io from "socket.io-client"

const socketContext = createContext()

export const useSocketContext = () => {
  return useContext(socketContext)
}
export const SocketContextProvider = ({ children }) => {
  const { authUser } = AuthUseContext()
  //   console.log(authUser.data._id)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (authUser) {
      //connect to secket and send logged user id to add to online users
      const socket = io("https://chat-app-iduc.onrender.com/", {
        query: {
          userId: authUser.data._id,
        },
      })
      setSocket(socket)
      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (users) => {
        // console.log(users)
        setOnlineUsers(users)
      })

      return () => socket.close()
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [authUser])
  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  )
}
