const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.module") 
const { resume } = require("../services/temp");
const { model } = require("mongoose");

const normalizeQuestion = (item) =>
    typeof item === "string"
        ? {
            question: item,
            intention: "Assess how you approach this topic.",
            answer: "Explain your approach clearly and support it with a practical example."
        }
        : item;

const normalizePreparationItem = (item, index) => {
    if (typeof item !== "string") {
        return item;
    }

    const match = item.match(/^Day\s*(\d+)\s*:\s*(.+)$/i);
    return {
        day: match ? Number(match[1]) : index + 1,
        focus: match ? match[2] : item,
        tasks: [match ? match[2] : item]
    };
};

const normalizeSkillGap = (item) => {
    const skill = typeof item === "string" ? item : item?.skill;
    const severity = typeof item === "string" ? "Medium" : item?.severity;

    return {
        skill: skill || "General interview readiness",
        severity: severity
            ? severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()
            : "Medium"
    };
};

/**
 * @description Controller to generate interview report by jobDescription, selfDescription and resume
 */
async function generateInterviewReportController(req, res) {
    const pdfParse = require("pdf-parse");
    let resumeText = ""
    if (req.file?.buffer) {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        resumeText = resumeContent.text
    }
    const {selfDescription, jobDescription, } = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })
    const {
        technicalQuestions,
        behavioralQuestions: behaviouralQuestions,
        skillGaps,
        preparationPlan,
        ...reportFields
    } = interviewReportByAi
    const interViewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...reportFields,
        technicalQuestions: (technicalQuestions ?? []).map(normalizeQuestion),
        behaviouralQuestions: (behaviouralQuestions ?? []).map(normalizeQuestion),
        skillGap: (skillGaps ?? []).map(normalizeSkillGap),
        preparationPlan: (preparationPlan ?? []).map(normalizePreparationItem)
    })

    res.status(201).json ({
        message: "Interview report genearated successfully.",
        interviewReport: interViewReport
    })
}

/**
 * @description Controller to get interview report by interviewId
 */
async function generateInterviewReportByIdController(req, res) {
    const {interviewId} = req.params

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

    if(!interviewReport){
        return res.status(400).json({
            message: "Interview Report not found! "
        })
    }
    res.status(200).json({
        message: "Interview Report fetched successfully",
        interviewReport
    })
}

/**
 * @description Get all interview for the user
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGap -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}
module.exports = {generateInterviewReportController, generateInterviewReportByIdController, getAllInterviewReportsController}