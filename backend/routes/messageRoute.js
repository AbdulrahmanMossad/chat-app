const express = require("express")
const multer = require("multer")
const {
  sendMessageService,
  getMessageService,
  getMessageService2,
  sendAudioMessage,
} = require("../services/messageService")
const protectRoute = require("../middleware/protectRoute")
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, `audio-${uniqueSuffix}.wav`)
  },
})

const upload = multer({ storage })
router.post(
  "/send-audio/:id",
  protectRoute,
  upload.single("audio"),
  sendAudioMessage
)
router.post("/send/:id", protectRoute, sendMessageService)
router.get("/:id", protectRoute, getMessageService)
router.get("/last/:id", protectRoute, getMessageService2)

module.exports = router
