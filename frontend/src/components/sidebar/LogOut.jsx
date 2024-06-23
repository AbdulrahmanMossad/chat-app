import { BiLogOut } from "react-icons/bi"
import { IoIosContacts } from "react-icons/io"
import LogoutHook from "../../hook/logoutHook"

function LogOut() {
  const [
    focusStyle,
    focusContacts,
    focusLogOut,
    loading,
    handleFocusContacts,
    handleFocusLogOut,
    handelLogOut,
  ] = LogoutHook()

  return (
    <div className="p-2 bg-gray-900 rounded-sm flex items-center ">
      <div
        className={`${
          focusContacts
            ? focusStyle
            : "w-[50%] flex justify-center hover:bg-gray-700 hover:rounded-full cursor-pointer"
        }`}
        onClick={handleFocusContacts}
      >
        <div className="flex flex-col justify-center items-center">
          <IoIosContacts
            className="w-6 h-6 text-gray-400 cursor-pointer"
            id="contacts"
          />
          <p
            className="text-gray-400 text-sm cursor-pointer"
            htmlFor="#contacts"
          >
            Contacts
          </p>
        </div>
      </div>
      <div
        className={`${
          focusLogOut
            ? focusStyle
            : "w-[50%] flex justify-center hover:bg-gray-700 hover:rounded-full cursor-pointer"
        }`}
        onClick={handleFocusLogOut}
      >
        <div className="flex flex-col justify-center items-center">
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <BiLogOut
              className="w-6 h-6 text-gray-400 cursor-pointer"
              id="logout"
              onClick={handelLogOut}
            />
          )}
          <p className="text-gray-400 text-sm cursor-pointer" htmlFor="#logout">
            Logout
          </p>
        </div>
      </div>
    </div>
  )
}

export default LogOut
