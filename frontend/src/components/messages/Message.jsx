import { format, parseISO } from "date-fns"
import { useState, useRef, useEffect } from "react"
import { AuthUseContext } from "../../context/AuthContext"
import { MdPlayArrow, MdPause } from "react-icons/md"

function Message({ message, conversationWith }) {
  const { authUser } = AuthUseContext()
  const fromMe = message.senderId === authUser.data._id
  const shakeClass = message.shouldShake ? "shake" : ""
  const chatClassName = fromMe ? "chat-end" : "chat-start"
  const profilePic = fromMe
    ? authUser.data.profilePic
    : conversationWith?.data?.results[0]?.profilePic
  const bubbleBgColor = fromMe ? "bg-blue-500" : ""

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(new Audio(`https://chat-app-iduc.onrender.com/${message.audio}`))

  // State to track currently playing audio
  const [currentAudio, setCurrentAudio] = useState(null)

  useEffect(() => {
    const audio = audioRef.current

    const updateDuration = () => setDuration(audio.duration)

    const updateCurrentTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("timeupdate", updateCurrentTime)

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("timeupdate", updateCurrentTime)
    }
  }, [])

  const togglePlay = () => {
    if (currentAudio && currentAudio !== audioRef.current) {
      // Stop currently playing audio
      currentAudio.pause()
      setIsPlaying(false)
    }

    if (!isPlaying) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setCurrentAudio(audioRef.current)
        })
        .catch((error) => {
          console.log("Playback error:", error)
        })
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
      setCurrentAudio(null)
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = parseISO(timestamp)
    const now = new Date()
    const isToday = now.toDateString() === date.toDateString()
    const isYesterday = now.setDate(now.getDate() - 1) === date.toDateString()

    if (isToday) {
      return format(date, "HH:mm")
    } else if (isYesterday) {
      return `Yesterday at ${format(date, "HH:mm")}`
    } else {
      return format(date, "MMMM d, yyyy HH:mm")
    }
  }

  const formatDuration = (seconds) => {
    // console.log(seconds)
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={profilePic} />
        </div>
      </div>
      {message.audio ? (
        <div className="flex items-center space-x-2 ">
          <button className="text-white" onClick={togglePlay}>
            {isPlaying ? (
              <MdPause className="text-white" />
            ) : (
              <MdPlayArrow className="text-white" />
            )}
          </button>
          <div className="voice-message bg-slate-500 p-2 rounded-lg flex items-center space-x-2">
            <div className="text-xs text-gray-400">
              <span className=" ">
                <div className="text-xs text-gray-400 w-10 flex justify-center border-b border-gray-400">
                  {/* Remove "00:00" text */}
                </div>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 break-words`}
        >
          {message.message}
        </div>
      )}
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formatTimestamp(message.createdAt)}
      </div>
    </div>
  )
}

export default Message
