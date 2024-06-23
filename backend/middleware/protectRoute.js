const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    // console.log(token)
    if (!token) {
      console.log("1")
      return res.status(401).json({ message: "Not Authorized" })
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    if (!decoded) {
      console.log("2")
      return res.status(401).json({ message: "Not Authorized" })
    }
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      console.log("3")
      return res.status(401).json({ message: "Not Authorized" })
    }
    req.user = user

    next()
  } catch (err) {
    console.log("Error in protection", err.message)
    res.status(500).json({ error: "Internal Server error" })
  }
}
module.exports = protectRoute
