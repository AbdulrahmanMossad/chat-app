import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { AuthUseContext } from "../context/AuthContext"
function LoginHook() {
  const { setAuthUser } = AuthUseContext()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = handelErrors()
    if (!errors) {
      return
    }
    setLoading(true)
    await axios
      .post(
        "https://chat-app-iduc.onrender.com/api/v1/auth/login",
        {
          username: username,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then(function (response) {
        toast.success("Successfully toasted!")
        setUsername("")
        setPassword("")
        localStorage.setItem("chat-user", JSON.stringify(response))
        setAuthUser(response)
        // console.log(response)
      })
      .catch(async function (error) {
        // await toast.error(error.response.data.error)
        console.log(error)
      })
    setLoading(false)
    // console.log(inputs)
  }
  const handelErrors = () => {
    if (!username || !password) {
      toast.error("Please fill in all fields")
      return false
    }
    return true
  }

  return [username, setUsername, password, setPassword, loading, handleSubmit]
}

export default LoginHook
