const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("The difficulty level of the technical question"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      reason: z.string().describe("Why this question is relevant in the interview"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })
  ).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The behavioral question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      reason: z.string().describe("The reason why this question is asked in the interview"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })
  ).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill which the candidate is lacking"),
      importance: z.enum(["Low", "Medium", "High"]).describe("The severity of the skill gap"),
      reason: z.string().describe("The reason why this skill is important for the job description and how it can impact the candidate's performance in the interview"),
    })
  ).describe("List of skill gaps in the candidate's profile along with their severity"),
  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan, starting from 1"),
      focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
      tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan"),
    })
  ).describe("A day-wise preparation plan for the candidate to follow in order to reach the job description"),
  title: z.string().describe("The title of the job for which the interview report is generated"),
  overallRecommendation: z.string().describe("The overall recommendation for the candidate based on the interview report"),
});

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:
  Resume: ${resume}
  jobDescription: ${jobDescription}
  selfDescription: ${selfDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
  });
  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string().describe("The html content of the resume which can be converted to pdf using any library like puppeteer"),
  });

  const prompt = `Generate a resume for a candidate with the following details:
  Resume: ${resume}
  jobDescription: ${jobDescription}
  selfDescription: ${selfDescription}

  The resume should be in HTML format and ready to convert to PDF using Puppeteer, tailored for the given job description and aligned with the candidate's skills and experience. It should sound like a human-written, professional, ATS-friendly resume, concise, unique, and optimized for the job. Keep it to a single page and polished but not flashy.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };