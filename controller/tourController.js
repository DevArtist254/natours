const Tour = require('../model/toursModel');
const APIFeatured = require('./../utils/features');

exports.getTourFiveTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  req.query.fields = 'name,price,duration,ratingsAverage';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    let feature = new APIFeatured(Tour.find(), req.query)
      .filter()
      .sorted()
      .fields()
      .pagination();

    const tours = await feature.query;
    res.status(200).json({
      message: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({
      errMessage: error.errMessage,
    });
  }
};

exports.createATour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(200).json({
      message: 'success',
      tour,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Invalid String',
    });
  }
};

exports.getATour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id, (err, tour) => {
      console.log(err);
    });

    res.status(200).json({
      message: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: 'invalid id',
    });
  }
};

exports.findAndUpdate = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: 'updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed ',
    });
  }
};

exports.findAndDelete = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      message: 'success',
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed ',
    });
  }
};
