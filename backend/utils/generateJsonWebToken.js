var jwt = require("jsonwebtoken")
const generateJsonWebToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  })
  res.cookie("jwt", token, {
    httpOnly: true, // to prevent xss(cross-site scripting attacks)
    maxAge: 30 * 24 * 60 * 60 * 1000, //expiresIn :30 days in milliseconds
    sameSite: "strict", //to prevent CSRF (cross-site request forgery attacks)
    secure: process.env.NODE_ENV !== "development", //will be secure in production mode
  })
}
module.exports = generateJsonWebToken
