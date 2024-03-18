const JWT = require("jsonwebtoken")
const jwtConfig = require("./jwt-config")

let validateToken = (req,res,next) => {
    let tokenvalue = req.headers["authorization"];
    if(tokenvalue){
        JWT.verify(tokenvalue, jwtConfig.secret, (error,data) => {
            if(error){
                res.status(500).json({
                    status: 0,
                    message: "Invalid Token"
                })
            }else{
                req.data = data;
                next()
            }
        })
    }else{
        res.status(404).json({
            status: 0,
            message: "Token not found"
        })
    }
}

module.exports = {
    checkToken: validateToken
}