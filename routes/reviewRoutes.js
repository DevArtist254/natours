const express = require('express');
const {protect,restrictTo} = require("./../controller/authController");
const {createAReview,findAndDelete,getAllReviews,findAndUpdate} = require("./../controller/reviewController")

const router = express.Router({mergeParams: true});

//router.use(restrictTo("user"))

router.get("/getAllReview", getAllReviews)
router.post("/createAReview", protect,createAReview);
router.patch('./id/findAndUpdate', findAndUpdate);
router.delete('/:id/delAReview', findAndDelete);

module.exports = router;