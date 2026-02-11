import { extractText } from "../middleware/resumeExtract.middleware.js";
import Resume from "../models/resume.model.js";
import { main } from "../service/gemini_service.js";
import Message from '../models/message.model.js'


const uploadResume = async (req, res) => {
    try {
        const { message } = req.body;

        if (!req.file) {
            return res.status(400).json({ msg: "File is required" });
        }

        const resumeText = await extractText(req.file.path, req.file.mimetype);

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({ msg: "Could not extract text from resume" });
        }
const defaultMessage ="Analyze my resume and give strengths, weaknesses, and improvement suggestions.";
        const cleanMessage = typeof message === "string" ? message.trim() : defaultMessage;

        const resume = await Resume.create({
            resumeloc: req.file.path,
            resumeText,
            userID: req.user.id
        });


        try {
            const response = await main(resumeText, cleanMessage);

            await Message.create({
                resumeID: resume._id,
                message: cleanMessage,
                reply: response
            });

            return res.status(200).json({ reply: response, resumeID: resume._id });

        } catch (aiError) {
            console.log("AI Error:", aiError);

            let msg = "AI failed. Please try again later.";

            if (aiError?.status === 503) {
                msg = "The AI service is currently busy. Please try again in a few minutes.";
            } else if (aiError?.status === 429) {
                msg = "You have exceeded today's AI usage limit. Please try again tomorrow.";
            }


            await Message.create({
                resumeID: resume._id,
                message: cleanMessage,
                reply: msg
            });

            return res.status(aiError?.status || 500).json({msg,resumeID: resume._id});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};



const resumeQuestion = async (req, res) => {
    try {
        const { message, resumeID } = req.body;

        const resume = await Resume.findOne({
            _id: resumeID,
            userID: req.user.id
        });

        if (!resume) {
            return res.status(400).json({ msg: "Resume not Found" });
        }
const defaultMessage =
  "Analyze my resume and give strengths, weaknesses, and improvement suggestions.";
        const clearMessage = typeof message === "string" ? message.trim() : defaultMessage;

        const allMessages = await Message.find({ resumeID }).sort({ createdAt: 1 });
        const history = allMessages.slice(-10);

        try {
            const response = await main(resume.resumeText, clearMessage, history);

            await Message.create({
                resumeID,
                message: clearMessage,
                reply: response
            });

            return res.status(200).json({ reply: response });

        } catch (aiError) {
            console.log("AI Error:", aiError);

            let msg = "AI failed. Please try again later.";

            if (aiError?.status === 503) {
                msg = "The AI service is currently busy. Please try again in a few minutes.";
            } else if (aiError?.status === 429) {
                msg = "You have exceeded today's AI usage limit. Please try again tomorrow.";
            }


            await Message.create({
                resumeID,
                message: clearMessage,
                reply: msg
            });

            return res.status(aiError?.status || 500).json({ msg });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};



const resumeHistory = async (req, res) => {
    try {
        const resumeID = req.params.resumeID;

        const allMessages = await Message.find({ resumeID }).sort({ createdAt: 1 });

        res.status(200).json({ allMessages });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userID: req.user.id })
      .sort({ createdAt: -1 })
      .select("_id resumeloc");

    res.status(200).json({ resumes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


export { uploadResume, resumeQuestion, resumeHistory, getUserResumes };

