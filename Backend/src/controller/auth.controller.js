const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @description register a new user, expect- username, email, password
 * @access Public
 */
async function registerUserController(req, res) {
    const {username, password} = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email, password."
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if(isUserAlreadyExist){
        return res.status(400).json({
            message: "Accounts already exists with this username and email."
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRETE, { expiresIn: "1d"});

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.status(201).json({
        message: "User register successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })  
}

/**
 * @name logInController
 * @description log in a user, expect- email and password in request body
 * @access Public
 */
async function logIncontroller(req, res) {
    
    const {password} = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if(!email || !password){
        return res.status(400).json({
            message: "Please provide email and password."
        });
    }
    
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).json({
            message: "Invalid email or password. Register an account first if you are a new user."
        })
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid email or password."
        });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRETE, { expiresIn: "1d"});

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }); //this saves to browser cookie and the name of the cookie = token.

    res.status(201).json({
        message: "User logged in successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    }) 
}

/**
 * @name logOutController
 * @description clear token after logout and add token into blacklist.
 * @access Public
 */
async function logOutUserController(req, res) {
    
    //Cookie-এর token থাকলে সেটা নাও, না থাকলে Authorization header-এর token নাও।
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({
            message: "No token found to blacklist."
        });
    }

    await tokenBlacklistModel.create({ token });

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.status(200).json({
        message: "User Logged out successfully!"
    });


    
}

/**
 * @name getMeController
 * @Description get the current logged in user detailed. 
 * @Access Public 
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "user detailed fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
    
}


module.exports = {
    registerUserController,
    logIncontroller,
    logOutUserController,
    getMeController
};