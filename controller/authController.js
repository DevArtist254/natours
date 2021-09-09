const User = require("./../model/usersModel")
const catchAsync = require("./../utils/catchAsync")


exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    //Status 201 for created
    res.status(201).json({
        message: 'success',
        data: {
            newUser
        }
    })
}) 