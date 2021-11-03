const factory = require("./factoryHandler")
const catchAsync = require("./../utils/catchAsync")
const ErrorHandle = require('./../utils/errorApp')
const User = require("./../model/usersModel")

exports.getMe = catchAsync(async(req,res,next) =>{
    if(req.user.id) req.params.id = req.user.id 

    next()
})

exports.getAllUsers = factory.getAll(User)
exports.getAUser = factory.getOne(User)
exports.deleteAdmin = factory.deleteOne(User)

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    //loop thru the keys of the incoming of the object
    Object.keys(obj).forEach(el => {
        //if the obj contains any of the allowed fields create a new obj
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj;
}

exports.updateMe = catchAsync(async(req,res,next) => {
    //Check if user has updated password data
    if(req.body.password || req.body.passwordConfirm ){
        next(new ErrorHandle("Password updates cant here, Please use /updateMyPassword"))
    }

    //filter out un wanted data
    const allowedData = filterObj(req.body, "name","email")

    //update user data
    const updateData = await User.findByIdAndUpdate(req.user.id, allowedData,{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        message: 'success',
        data: {
          user: updateData
        },
      });
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active : fasle})

    res.status(204).json({
        status: 'success',
        data: null
    })
})


