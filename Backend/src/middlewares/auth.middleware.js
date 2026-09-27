const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next){
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is invalid."
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);
        req.user = decoded;
        next();

    }catch(err){
        return res.status(401).json({
            message: "Invalid token."
        })
    }
}

module.exports = {
    authUser
}