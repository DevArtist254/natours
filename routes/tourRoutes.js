const express = require('express');
const {
  getAllTours,
  createATour,
  getATour,
  checkId,
  middleware,
} = require('../controller/tourController');

const router = express.Router();

router.param('id', checkId);

router.get('/', getAllTours);
//Chaining middleware
router.post('/', middleware, createATour);
router.get('/:id', getATour);

module.exports = router;
