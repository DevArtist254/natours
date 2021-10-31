const express = require('express');
const {protect} = require("./../controller/authController");
const {createAReview,findAndDelete,getAllReviews,findAndUpdate} = require("./../controller/reviewController")

const router = express.Router({mergeParams: true});

router.post("/createAReview", protect,createAReview),
router.get("/getAllReview", getAllReviews)
router.delete('/:id/delAReview', findAndDelete);
router.patch('./id/findAndUpdate', findAndUpdate)


module.exports = router;