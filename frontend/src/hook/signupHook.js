import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { AuthUseContext } from "../context/AuthContext"

const SignupHook = () => {
  const { setAuthUser } = AuthUseContext()
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirm: "",
    gender: "",
    // lastMessage: "say hi! 👋",
  })
  const [selectedGender, setSelectedGender] = useState("")
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
        "https://chat-app-iduc.onrender.com/api/v1/auth/signup",
        {
          fullName: inputs.fullName,
          username: inputs.username,
          password: inputs.password,
          confirm: inputs.confirm,
          gender: inputs.gender,
          // lastMessage: inputs.lastMessage,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then(function (response) {
        toast.success("Successfully toasted!")
        setInputs({
          ...inputs,
          fullName: "",
          username: "",
          password: "",
          confirm: "",
          gender: "",
          // lastMessage: "",
        })
        localStorage.setItem("chat-user", JSON.stringify(response))
        setAuthUser(response)
        console.log(response)
      })
      .catch(async function (error) {
        await toast.error(error?.response?.data?.error)
        console.log(error)
      })
    setLoading(false)
    // console.log(inputs)
  }
  const handelErrors = () => {
    if (
      !inputs.fullName ||
      !inputs.username ||
      !inputs.password ||
      !inputs.confirm ||
      !inputs.gender
    ) {
      toast.error("Please fill in all fields")
      return false
    }
    if (inputs.password !== inputs.confirm) {
      toast.error("Passwords do not match")
      return false
    }
    if (inputs.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return false
    }
    return true
  }

  const onCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender: gender })
    setSelectedGender(gender)
  }

  return [
    handleSubmit,
    inputs,
    setInputs,
    selectedGender,
    onCheckboxChange,
    loading,
  ]
}

export default SignupHook
