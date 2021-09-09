const mongoose = require("mongoose")
const validator = require("validator")
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
    password : {
        type : String,
        minLength : 8,
        require: [true, "Please enter your password"]
    },
    photo : {
        type : String
    },
    passwordConfrim : {
        type : String
    }
})

module.exports = mongoose.model("User", userSchema)