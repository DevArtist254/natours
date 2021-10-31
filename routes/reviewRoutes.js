const express = require('express');
const {protect} = require("./../controller/authController");
const {createAReview,findAndDelete,getAllReviews} = require("./../controller/reviewController")

const router = express.Router({mergeParams: true});

router.post("/createAReview", protect,createAReview),
router.get("/getAllReview", getAllReviews)
router.delete('/delAReview/:id', findAndDelete);


module.exports = router;