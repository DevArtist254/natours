const express = require('express');
const {signup,login,protect,forgotPassword,resetPassword,updatePassword} = require("./../controller/authController");
const {updateMe,deleteMe} = require("./../controller/userController")
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/forgotPassword", protect,forgotPassword)
router.patch("/resetPassword/:resetToken", protect,resetPassword)
router.patch("/updatePassword", protect,updatePassword)
router.patch("/updateMe", protect, updateMe)
router.delete("/deleteMe", protect, deleteMe)


module.exports = router;