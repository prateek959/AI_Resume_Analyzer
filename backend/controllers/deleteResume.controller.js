import fs from 'fs'
import Resume from '../models/resume.model.js';
import Message from '../models/message.model.js';

const deleteResume = async (req, res) => {
    try {
        const resumeID = req.params.resumeID;

        const resumeData = await Resume.findOne({ _id: resumeID, userID: req.user.id });

        if (!resumeData) {
            return res.status(400).json({ msg: "Resume not Found" });
        };


        const filePath = resumeData.resumeloc;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await Message.deleteMany({ resumeID });
        await Resume.deleteOne({ _id: resumeID });
        res.status(200).json({ msg: "Resume deleted successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


export { deleteResume };