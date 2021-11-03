const express = require('express');
const {signup,login,protect,forgotPassword,resetPassword,updatePassword,restrictTo} = require("./../controller/authController");
const {updateMe,deleteMe,deleteAdmin,getAllUsers,getAUser,getMe} = require("./../controller/userController")
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/forgotPassword",forgotPassword)
router.patch("/resetPassword/:resetToken",resetPassword)

router.use(protect)

router.get("/getAll", getAllUsers)
router.get("/me", getMe,getAUser)
router.patch("/updatePassword",updatePassword)
router.patch("/updateMe", updateMe)
router.delete("/deleteMe", deleteMe)
router.delete("/deleteAdmin/:id", restrictTo("admin"),deleteAdmin)


module.exports = router;