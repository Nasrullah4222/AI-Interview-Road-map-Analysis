const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route POST api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description login user with emmail and password
 * @access Public
 */
authRouter.post("/login", authController.logIncontroller);

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logOutUserController);

/**
 * @route GET /api/auth/get-me
 * @description Get the details of the currently authenticated user
 * @access Private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);


module.exports = authRouter;