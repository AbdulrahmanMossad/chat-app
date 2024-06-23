const mongoose = require("mongoose")

//connect to mongo db
const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log("connected to mongo db")
  } catch (error) {
    console.log("Error while connecting to database", error)
  }
}
module.exports = connection
