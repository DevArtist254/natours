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
      proErrorHandling(err,res) 
    }
  }