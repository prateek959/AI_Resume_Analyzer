import fs from 'fs/promises';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

// import { createRequire } from 'module';

// const require = createRequire(import.meta.url);
// const pdfParse = require('pdf-parse'); // Load pdf-parse correctly

export const extractText = async (filePath, filemimetype) => {
  try {
     
    let text = "";
    if (filemimetype === "application/pdf") {
      const bufferData = await fs.readFile(filePath);
      const data = await pdfParse(bufferData);
      text = data.text;
    }
    else if (filemimetype.includes("wordprocessingml.document")) {
      const data = await mammoth.extractRawText({ path: filePath });
      text = data.value;
    }
    else if (filemimetype === "text/plain") {
      text = await fs.readFile(filePath, "utf-8");
    }
    else {
      throw new Error("Only PDF, DOCX, TXT are allowed");
    }

    return text.replace(/\s+/g, " ").trim();

  } catch (error) {
    console.error(error);
    throw error;
  }
};
