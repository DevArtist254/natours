const { promisify } = require("util")
const catchAsync = require("./../utils/catchAsync")
const jwt = require("jsonwebtoken")
const ErrorHandle = require('./../utils/errorApp')
const User = require("./../model/usersModel")
const sendEmail = require("./../utils/email")
const crypto = require("crypto")


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
        passwordConfirm : req.body.passwordConfirm
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

exports.protect = catchAsync(async (req,res,next) => {
    let token;
   //get token 
    if(req.headers.authorizaton && req.headers.authorizaton.startsWith("Bearer")){
        token = req.headers.authorizaton.split(" ")[1]
    }
    //check there is a token
    if(!token){
        return next(new ErrorHandle("access denied", 401))
    }
    
   //verification the token promisify the decoded value
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

   //check if user still exists 
   let existingUser = await User.findById(decoded.id)
    if(!existingUser){
        return next(
            new ErrorHandle("Access denied", 401)
        )
    }

   //check if user changed password after the token was issued 
   if(existingUser.changedPasswordAfter(decoded.iat)){
       return next(new ErrorHandle("Access denied", 401))
   }

   req.user = existingUser
    next()
})

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        //roles = 'user'
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandle("Access denied",403))
        }

        next()
    }
}

exports.forgotPassword = async (req,res,next) => {
    const {email} = req.body
    //1. Get user based on posted email
    const user = await User.findOne({email})

    if(!user){
        return next(new ErrorHandle("user with that email does not exist", 404))
    }

    //Generate the random reset token using init
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false})

    // 3) send it to the user
    // 3:a set up the url string
    const resetURL =  `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    console.log(resetURL)

    const text = `Forgot your password? Submit a patch request with your new password to: ${resetURL}`

    try {
        await sendEmail({
        email: user.email,
        subject: `Your password reset token (vaild for 10 min)`,
        message: text
    })

    res.status(200).json({
        status: `success`,
        message: `token sent to email`
    })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandle(`Fuck you`,500))
    }
}

exports.resetPassword = catchAsync(async (req,res,next) => {
    //encrypt the received crypto
    const cryptoReset = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

    //Check for the user with the reset token
    const user = await User.findOne({
        passwordResetToken : cryptoReset,
        passwordResetExpires : {$gt : Date.now()}
    })

    if(!user) new ErrorHandle("Inavlid token try again", 400)
    //reset the crypto and update password 
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    
    //token assign
    const token = jwtSign(user._id)

    //Status 201 for created
    res.status(201).json({
        message: 'success',
        data: {
            user : token
        }
    })
})