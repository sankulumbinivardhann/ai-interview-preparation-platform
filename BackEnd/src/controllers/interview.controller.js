const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../Services/ai.service");
const interviewReportModel = require("../models/interviewReport.model.js");

/**
 * @description controller to generate interview report based on the user self description, resume and job description
 */
async function generateInterviewReportController(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "Resume file is required",
    });
  }

  try {
    const pdfData = await pdfParse(req.file.buffer);
    const resumeContent = pdfData.text || "";
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    res.status(201).json({
      message: "Interview Report Generated Successfully...",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
}


/**
 * @description controller to get interview report by interview Id
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  try {
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview Report not found",
      });
    }

    res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error fetching interview report by ID:", error);
    res.status(500).json({
      message: "Failed to fetch interview report",
      error: error.message,
    });
  }
}


/**
 * @description 
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v");

    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.error("Error fetching interview reports:", error);
    res.status(500).json({
      message: "Failed to fetch interview reports",
      error: error.message,
    });
  }
}


/**
 * @description controller to generate resume pdf from user self description and job description
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  try {
    const interviewReport = await interviewReportModel.findById(interviewReportId);
    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview Report not found",
      });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    res.status(500).json({
      message: "Failed to generate resume PDF",
      error: error.message,
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};