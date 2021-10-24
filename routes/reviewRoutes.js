const express = require('express');
const {protect} = require("./../controller/authController");
const {createAReview,getAllReviews} = require("./../controller/reviewController")

const router = express.Router();

router.post("/createAReview", protect,createAReview),
router.get("/getAllReview", getAllReviews)

module.exports = router;