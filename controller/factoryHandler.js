const ErrorHandle = require('./../utils/errorApp')
const catchAsync = require("./../utils/catchAsync")

exports.deleteOne = Model => catchAsync(async (req, res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return new ErrorHandle(`There is no such tour`, 404)
    }

      res.status(204).json({
        message: 'success',
      });
  })

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!doc){
    return new ErrorHandle(`There is no such tour`, 404)
  }
  
  res.status(200).json({
    message: 'success',
    data: {
      doc
    },
  });
}) 

exports.createOne = Model => catchAsync(async (req, res,next) => {
  const doc = await Model.create(req.body);

  //Sending 404 errors null falsy val NULL = tour
  if(!doc){
    return new ErrorHandle(`There is no such tour`, 404)
  }

    res.status(200).json({
      message: 'success',
      doc,
    });
}) 

exports.getOne = (Model,popOpt) => catchAsync(async (req, res, next) => {
  const doc = await Model.findById(req.params.id, (err) => {console.log(err)}).populate(popOpt)

  if(!doc){
    return new ErrorHandle(`There is no such tour`, 404)
  }

  res.status(200).json({
    message: 'success',
    data: {
      doc,
    },
  });
})

exports.getAll = Model => catchAsync(async (req, res, next) => {
  let filter = {}
    if(!req.params.tourId) filter = {reviewedTour : req.params.tourId}

  let feature = new APIFeatured(Model.find(filter), req.query)
      .filter()
      .sorted()
      .fields()
      .pagination();

    const doc = await feature.query;
    res.status(200).json({
      message: 'success',
      results: tours.length,
      data: { doc },
    });
}) 

