const express = require("express")
const protectRoute = require("../middleware/protectRoute")
const {
  getUsersForSidebar,
  getSpecificUser,
} = require("../services/usersService")
const router = express.Router()
// router.get("/",protectRoute,getUsersForSidebar)
router.route("/").get(protectRoute, getUsersForSidebar)
router.route("/:id").get(protectRoute, getSpecificUser)

module.exports = router
