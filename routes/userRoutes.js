const express = require('express');
const {signup,login,protect,forgotPassword,resetPassword,updatePassword} = require("./../controller/authController");
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/forgotPassword", protect,forgotPassword)
router.patch("/resetPassword/:resetToken", protect,resetPassword)
router.patch("/updatePassword", protect,updatePassword)


module.exports = router;