const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controller/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST/ api/ interview
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access privat
 */
interviewRouter.post("/",authMiddleware.authUser, upload.single("resume"),interviewController.generateInterviewReportController);

/**
 * @route GET/api/interview/:interviewId
 * @description get interview report by interviewId
 * @access privat
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.generateInterviewReportByIdController)

/**
 * @route GET/api/interview/
 * @description get all interview reports of logged in user.
 * @access privat
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

module.exports = interviewRouter;