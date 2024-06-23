import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { AuthUseContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
function LogoutHook() {
  const { setAuthUser } = AuthUseContext()
  const focusStyle =
    "w-[50%] flex justify-center bg-gray-800 rounded-full cursor-pointer"
  const [focusContacts, setFocusContacts] = useState(false)
  const [focusLogOut, setFocusLogOut] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleFocusContacts = () => {
    setFocusLogOut(false)
    setFocusContacts(true)
  }

  const handleFocusLogOut = () => {
    setFocusContacts(false)
    setFocusLogOut(true)
  }
  const handelLogOut = async () => {
    setLoading(true)
    await axios
      .post("https://chat-app-iduc.onrender.com/api/v1/auth/logout")
      .then(function (response) {
        toast.success("Loged Out!")
        localStorage.removeItem("chat-user")
        setAuthUser(null)
        Navigate("/login")
        console.log(response)
      })
      .catch(async function (error) {
        await toast.error(error.response.data.error)
        console.log(error)
      })
    setLoading(false)
  }
  return [
    focusStyle,
    focusContacts,
    focusLogOut,
    loading,
    handleFocusContacts,
    handleFocusLogOut,
    handelLogOut,
  ]
}

export default LogoutHook
