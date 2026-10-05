const express = require('express');
const authMiddleware = require("../middleware/autth.middleware.js")
const interviewController = require("../controllers/interview.controller.js")
const upload = require("../middleware/file.middleware.js")

const interviewRouter = express.Router();


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user selfDescription, resume pdf and jobDescription
 * @access private
 * 
 */
interviewRouter.post('/', authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController);



/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interview id
 * @access private
 */

interviewRouter.get('/report/:interviewId', authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET/ api/interview
 * @description get interview report by interviewID
 * @access private
 */
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController);


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user selfDescription, resume pdf and jobDescription
 * @access private
 */

interviewRouter.post('/resume/pdf/:interviewReportId', authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;
