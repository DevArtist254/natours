const express = require('express');
const {
  getAllTours,
  createATour,
  getATour,
} = require('../controller/tourController');

const router = express.Router();

router.get('/', getAllTours);
router.post('/', createATour);
router.get('/:id', getATour);

module.exports = router;
