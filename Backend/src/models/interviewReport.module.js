const mongoose = require("mongoose");
const { string } = require("zod");

/**
 * -Job Description: string
 * -Resume Text: string
 * -Self Description: string
 * 
 * -matchScore: Number
 * 
 * -Technical Questions:
 *       [{
 *           Questions: " ",
 *           Intention: " ",
 *           Answer: " ",    
 *        }]
 * 
 * -Behavioural Questions:
 *       [{
 *           Questions: " ",
 *           Intention: " ",
 *           Answer: " ",    
 *        }]
 * 
 * -Skill Gap:
 *       [{
 *           skill: " ",
 *           severity: {
 *               type: string,
 *               enum: ["Low", "Medium", High]
 *           },
 *           Answer: " ",    
 *        }]
 * 
 * -Preparation Plan:
 *       [{
 *           Day: Number,
 *           Focous: " ",
 *           Tasks: [String],    
 *        }]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, "Technical question is required"]
    },
    intention:{
        type: String,
        required: [true, "Intention is required"]
    },
    answer:{
        type: String,
        required: [true, "Answer is required"]
    }

},{
    id: false
})

const BehaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, "Behaviousral question is required"]
    },
    intention:{
        type: String,
        required: [true, "Intention is required"]
    },
    answer:{
        type: String,
        required: [true, "Answer is required"]
    }

},{
    id: false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true, "Skill is required"]
    },
    severity:{
        type: String,
        enum: ["Low", "Medium", "High"],
        required: [true, "Severity is required"]
    }
},{
    id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, "Day is required."]
    },
    focus:{
        type: String,
        required: [true, "Focus is required."]
    },
    tasks:[{
        type: String,
        required: [true, "Task is required."]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: [true, "Job description is required."]
    },
    resume:{
        type: String,
    },
    selfDescription:{
        type: String,
    },
    matchScore:{
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [BehaviouralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title:{
        type: string,
        required: [true, "Job title needed."]
    }
},{
    timestamps: true
})

const interviewReportModel = new mongoose.model("interviewReport", interviewReportSchema);

module.exports = interviewReportModel;