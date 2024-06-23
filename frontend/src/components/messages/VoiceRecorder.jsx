// VoiceRecorder.jsx
import React, { useState } from "react"
import axios from "axios"

const VoiceRecorder = ({ id, setMessageContext, messageContext }) => {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState("")
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [chunks, setChunks] = useState([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (e) => {
        setChunks((prevChunks) => [...prevChunks, e.data])
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setChunks([]) // Clear chunks after setting URL
      }

      recorder.start()
      setMediaRecorder(recorder)
      setRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      // Handle error state or feedback to the user
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setRecording(false)
    }
  }

  const handleSendVoiceMessage = async () => {
    try {
      const formData = new FormData()
      formData.append(
        "voice",
        new Blob(chunks, { type: "audio/webm" }),
        "voiceMessage.webm"
      )
      console.log(formData)
      const res = await axios.post(
        `https://chat-app-iduc.onrender.com/api/v1/messages/send/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )

      setMessageContext([...messageContext, res.data.message])
      setAudioUrl("") // Clear audio URL after sending
      setChunks([]) // Clear chunks after sending
    } catch (error) {
      console.error("Error sending voice message:", error)
      // Handle error state or feedback to the user
    }
  }

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
          <button onClick={handleSendVoiceMessage}>Send Voice Message</button>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder
