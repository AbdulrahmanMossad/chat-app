const express = require("express")
const router = express.Router()
const { signUp, login, logOut } = require("../services/authService")
router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logOut)

module.exports = router
