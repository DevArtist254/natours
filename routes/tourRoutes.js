const express = require('express');
const {
  getTourFiveTours,
  getAllTours,
  createATour,
  getATour,
  findAndDelete,
  findAndUpdate,
  getStatsAvgs,
  getHolidayStats
} = require('../controller/tourController');
const {protect,restrictTo} = require("./../controller/authController");


const router = express.Router();

//router.param('id', checkId);

router.get('/', protect, getAllTours);
router.get('/get-Averages', getStatsAvgs);
router.get('/get-tour-five-tours', getTourFiveTours, getAllTours);
router.get('/get-holiday-stats',getHolidayStats)
//Chaining middleware
router.post('/', createATour);
router.get('/:id', getATour);
router.patch('/:id', findAndUpdate);
router.delete('/:id', protect,restrictTo("admin","lead-guide"), findAndDelete);

module.exports = router;
