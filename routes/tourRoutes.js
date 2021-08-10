const express = require('express');
const {
  getTourFiveTours,
  getAllTours,
  createATour,
  getATour,
  findAndDelete,
  findAndUpdate,
} = require('../controller/tourController');

const router = express.Router();

//router.param('id', checkId);

router.get('/', getAllTours);
router.get('/get-tour-five-tours', getTourFiveTours, getAllTours);
//Chaining middleware
router.post('/', createATour);
router.get('/:id', getATour);
router.patch('/:id', findAndUpdate);
router.delete('/:id', findAndDelete);

module.exports = router;
