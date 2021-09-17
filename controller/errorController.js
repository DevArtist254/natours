const ErrorHandle = require("./../utils/errorApp") 

const validationErrorMessage = (err) => {
  const valueArr = Object.values(err.errors).map(val => val.message)
  const message = `invalid input ${valueArr.join(" ")}`

  return  new ErrorHandle(message, 400)
}

const messageCastError = (err) => {
  const message = `invalid ${err.path} : ${err.value}`
  return  new ErrorHandle(message, 400)
}

const handleJWTErr = () => new ErrorHandle("Access denied", 401)

const tokenExpired = () => new ErrorHandle("Timeout! please sign in again", 401)

const messageDuplicateError = err => {
 const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate value ${value}`
  return new ErrorHandle(message, 400)
}

function devErrorHandling(err,res) {

  //Send back as much
  res.status(err.statusCode).json({
    error: err,
    stack : err.stack,
    status: err.status,
    message: err.message
  })
}

function proErrorHandling(err,res) {
  if(err.isOps){
     //Operational error to send back a message
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    //Programming error to send back a generic message
    console.error('ErrorX', err)

    res.status(500).json({
      status: "500",
      message: "Something went wrong"
    })
  }
}

module.exports = (err,req,res,next) => {
    //defining error codes 
    err.statusCode = err.statusCode || 500
    err.status = err.status || "fail"

    if(process.env.NODE_ENV === "development"){
      devErrorHandling(err,res) 
    }else if(process.env.NODE_ENV === "production"){
      let error = {...err}

      if(error.name === "CastError") error = messageCastError(error)
      if(error.code === 11000) error = messageDuplicateError(error)
      if(error.name === "ValidationError") error = validationErrorMessage(error)
      if(error.name === "JsonWebTokenError") error = handleJWTErr()
      if(error.name === "TokenExpiredError") error = tokenExpired()

      proErrorHandling(error,res) 
    }
  }