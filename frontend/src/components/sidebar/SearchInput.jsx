import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { IoSearchSharp } from "react-icons/io5"
import { AuthUseContext } from "../../context/AuthContext"
function SearchInput({ conversations }) {
  // console.log(conversations)
  const [search, setSearch] = useState("")
  const { conversationsContext, setConversationsContext } = AuthUseContext()
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (conversationsContext) {
      setConversationsContext(
        conversations.filter((c) =>
          c.username.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
  }, [search])

  const handleSubmit = (e) => {
    e.preventDefault()
    // if (!search) return
    if (conversationsContext.length > 0) {
      // setSelectedConversation(conversation)
      // setSearch("")
    } else toast.error("No such user found!")
  }
  return (
    <div className="p-6 bg-gray-900 rounded-sm">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="search..."
          className="input input-bordered rounded-full bg-gray-700 w-full border-gray-600 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-circle  rounded-full  bg-gray-700 border-gray-600 text-white"
          onClick={handleSubmit}
        >
          <IoSearchSharp className="w-6 h-6 outline-none text-gray-100" />
        </button>
      </div>
    </div>
  )
}

export default SearchInput
