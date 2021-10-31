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

