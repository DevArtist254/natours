const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")
const crypto = require("crypto")
const { Schema } = mongoose

const userSchema = new Schema({
    fullName : {
        type: String,
        require: true
    },
    email : {
    type: String,
    unique: true,
    require: [true, "Please enter your email"],
    validate : [validator.isEmail, "Please enter a valid email"]
    },
    role : {
        type : String,
        enum : ["admin","guide","lead-guide","user"],
        default : "user"
    },
    password : {
        type : String,
        minLength : 8,
        require: [true, "Please enter your password"],
        select : false
    },
    photo : {
        type : String
    },
    passwordChangedAt : {
        type: Date,
        default: Date.now(),
      },
    passwordConfirm : {
        type : String,
        validate : {
            validator : function(el){
            el === this.password
        },
        message : "passwords don't match"
    }
    },
    passwordResetToken : String,
    passwordResetExpires : Date,
    active : {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre(/^find/,function (next){
    // this points to the current
    this.find({ active: {$ne : false}});
    next()
})

userSchema.pre("save", async function (next) {
    //Only run this function if password is modified
    if(!this.isModified("password")) return next()

    //pre salting be4 
    this.password = await bcrypt.hash(
        this.password, 12
    )

    //clearing the saved password
    this.passwordConfirm = undefined
    next()
})

//init(available on all user docs) fn to compare candidatePassword(cP) and userPassword(uP)
userSchema.methods.correctPassword = async function(cP, uP){
    //returns true or false
    return await bcrypt.compare(cP,uP)
}

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime()/1000 , 10
        )

        return JWTTimeStamp < changedTimeStamp
    }

    return false
}


userSchema.methods.createPasswordResetToken = function () {
    //Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    //then hash inorder to save it in the db
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 *1000;

    return resetToken;
}


module.exports = mongoose.model("User", userSchema)