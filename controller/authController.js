const jwt = require("jsonwebtoken")
const ErrorHandle = require('./../utils/errorApp')
const User = require("./../model/usersModel")
const catchAsync = require("./../utils/catchAsync")

const jwtSign = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        fullName : req.body.fullName,
        email : req.body.email,
        password : req.body.password,
        passwordConfrim : req.body.passwordConfrim
    });

    const token = jwtSign(newUser._id)

    //Status 201 for created
    res.status(201).json({
        message: 'success',
        data: {
            user : token
        }
    })
}) 

exports.login = catchAsync(async (req,res,next) => {
    const {email, password} = req.body

    // 1) check if email and password exists
    if(!email || !password) {
        return next(new ErrorHandle("invalid email or password", 400))
    }

    //2) check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandle("invalid email or password", 400))
    }

    //3) If everything ok, send token to client
    const token = jwtSign(user._id)

    //Status 201 for created
    res.status(201).json({
        message: 'success',
        data: {
            user : token
        }
    })
})
