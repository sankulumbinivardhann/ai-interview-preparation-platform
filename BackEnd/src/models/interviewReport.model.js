const mongoose = require('mongoose');

/**
 * -job description schema: string
 * -resume text: string
 * -self description: string
 * 
 * 
 * 
 * -matchScore: Number
 * -Technical Questions:
 *                 [{
 *                     question: "",
 *                     intention: "",
 *                     answer: "",
 *                  }]
 * -Behavioral Questions :
 *                 [{
 *                     question: "",
 *                      intention: "",
 *                      answer: "",
 *                 }]
 * -Skill Gaps:
 *                 [{
 *                    skill: "",
 *                    severity: "",
 *                    type: string,
 *                    enum: ['low', 'medium', 'high'],
 *                 }]
 * -Preperation Plan: 
 *                  [{
 *                   day: Number,
 *                   focus: string,
 *                  tasks: [string], 
 *                   }]
 * 
 */



const technicalQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty is required'],
  },
  intention: {
    type: String,
    required: [true, 'Intention is required'],
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
  },
}, { _id: false });


const behavioralQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
  },
  intention: {
    type: String,
    required: [true, 'Intention is required'],
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
  },
}, { _id: false });


const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    importance: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, { _id: false });


const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, 'Day is required'],
  },
  focus: {
    type: String,
    required: [true, 'Focus is required'],
  },
  tasks: [{
    type: String,
    required: [true, 'Task is required'],
  }],
}, { _id: false });


const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
  }, 
  resume:{
    type: String,
  }, 
  selfDescription: {
    type: String,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [technicalQuestionSchema],
  behavioralQuestions: [behavioralQuestionSchema],
  skillGaps: [skillGapSchema],
  preparationPlan: [preparationPlanSchema],
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  title:{
    type: String,
    required: [true, "Job Title is required"],
  },
  overallRecommendation: {
    type: String,
    required: [true, 'Overall recommendation is required'],
  }
}, { timestamps: true });


const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = interviewReportModel;