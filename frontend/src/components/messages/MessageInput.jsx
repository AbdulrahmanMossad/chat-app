import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { BsSend } from "react-icons/bs"
import { MdKeyboardVoice, MdStop } from "react-icons/md"
import { useParams } from "react-router-dom"
import { AuthUseContext } from "../../context/AuthContext"

const MessageInput = () => {
  const { setMessageContext, messageContext } = AuthUseContext()
  const { id } = useParams()
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const canvasRef = useRef(null)
  const animationIdRef = useRef(null)

  // Handle form submission to send text messages
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message) return

    await axios
      .post(
        `https://chat-app-iduc.onrender.com/api/v1/messages/send/${id}`,
        { message },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => {
        setMessageContext([...messageContext, res.data.message])
      })
      .catch((error) => {
        console.log(error)
      })

    setMessage("")
  }

  // Start recording audio
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data])
          }
        }

        recorder.start()
        setIsRecording(true)
      })
      .catch((error) => {
        console.log("Error accessing microphone:", error)
      })
  }

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  // Use effect to process audioChunks and send data when chunks update
  useEffect(() => {
    const handleAudioUpload = async () => {
      if (audioChunks.length === 0) return

      try {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        console.log("Audio Blob:", audioBlob) // Debug: Log audio blob
        console.log("Blob size:", audioBlob.size) // Debug: Log blob size

        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.wav")

        const res = await axios.post(
          `https://chat-app-iduc.onrender.com/api/v1/messages/send-audio/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        )
        // console.log(res.data)
        setMessageContext([...messageContext, res.data.message])
        setAudioChunks([]) // Clear audio chunks after successful upload
      } catch (error) {
        console.error("Error sending audio:", error)
      }
    }

    handleAudioUpload()
  }, [audioChunks, id, setMessageContext, messageContext])

  // Use effect to draw visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let analyserNode = null
    let barWidth = 6
    let barGap = 3
    let numBars = Math.floor(canvas.width / (barWidth + barGap))
    let barHeightArray = new Uint8Array(numBars)

    const drawVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (analyserNode) {
        analyserNode.getByteFrequencyData(barHeightArray)

        for (let i = 0; i < numBars; i++) {
          let barHeight = barHeightArray[i] / 2
          let x = i * (barWidth + barGap)
          let y = canvas.height - barHeight

          ctx.fillStyle = "#128C7E"
          ctx.fillRect(x, y, barWidth, barHeight)
        }
      }

      animationIdRef.current = requestAnimationFrame(drawVisualization)
    }

    if (isRecording) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      analyserNode = audioCtx.createAnalyser()
      const source = audioCtx.createMediaStreamSource(mediaRecorder.stream)
      source.connect(analyserNode)
      analyserNode.fftSize = 256
      drawVisualization()
    }

    return () => {
      cancelAnimationFrame(animationIdRef.current)
      analyserNode = null
    }
  }, [isRecording, mediaRecorder])

  return (
    <div className="px-4 my-3">
      <div className="relative w-full">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 pr-10 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
          {!isRecording ? (
            <button onMouseDown={startRecording} onTouchStart={startRecording}>
              <MdKeyboardVoice className="text-white text-2xl" />
            </button>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                className="w-20 h-10 rounded-lg bg-gray-800"
              />
              <button onClick={stopRecording}>
                <MdStop className="text-red-500 text-2xl" />
              </button>
            </>
          )}
          <button onClick={handleSubmit}>
            <BsSend className="text-white text-2xl" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageInput
