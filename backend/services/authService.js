const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel")
var jwt = require("jsonwebtoken")
const generateJsonWebToken = require("../utils/generateJsonWebToken")
exports.signUp = asyncHandler(async (req, res) => {
  try {
    const { fullName, username, password, confirm, gender, profilePic } =
      req.body
    if (req.body.password !== req.body.confirm) {
      res.status(400).json({ error: "Passwords do not match" })
      return
    }
    const user = await User.findOne({ fullName })
    if (user) {
      //user exists
      res.status(400).json({ error: "User already exists" })
      return
    }

    // HASH PASSWORD HERE
    const hashedPassword = await bcrypt.hash(password, 12)
    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
    req.body.password = hashedPassword
    req.body.profilePic =
      req.body.gender === "male" ? boyProfilePic : girlProfilePic
    User.create(req.body)
      .then((user) => {
        //generate token and save to  cookie
        generateJsonWebToken(user._id, res)
        res.status(201).send({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          profilePic: user.profilePic,
        })
      })
      .catch((error) => {
        res.status(400).send("Error while Sign Up", error)
      })
  } catch (error) {
    res.status(500).send("Internal Server Error", error)
  }
})

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    const isCorrectPassword = await bcrypt.compare(
      password,
      user?.password || ""
    )
    if (!user || !isCorrectPassword) {
      res.status(400).json({ error: "Invalid Credentials" })
      return
    }
    await generateJsonWebToken(user._id, res)
    res.status(200).send({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    })
  } catch (err) {
    res.status(500).send("Intenal Server Error", err)
  }
}
exports.logOut = (req, res) => {
  try {
    // res.clearCookie("jwt")
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged Out" })
  } catch (err) {
    res.status(500).send("Intenal Server Error", err)
  }
}
